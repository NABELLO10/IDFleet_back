import time
import requests
import json
from datetime import datetime
import pytz
import sys

def convertir_a_hora_local(timestamp, zona_horaria_str):
    zona_horaria = pytz.timezone(zona_horaria_str)
    fecha_utc = datetime.utcfromtimestamp(timestamp).replace(tzinfo=pytz.utc)
    fecha_local = fecha_utc.astimezone(zona_horaria)
    return fecha_local.strftime('%Y-%m-%d %H:%M:%S')

def main():
    try:
        #EndPoint API REST para Inicio de sesión con Token Asignado
        urlInicio = 'https://hst-api.wialon.com/wialon/ajax.html?svc=token/login'
        token = sys.argv[1]
        unidades_str = sys.argv[2]
        argumentosInicio = {'params':'{"token":"' + f'{token}' + '", "fl":"1"}'}

        #EndPoint API REST para traer datos de unidad (Patente)
        urlUnidad = 'https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_item'

        responseToken = requests.get(urlInicio, params=argumentosInicio)
        if responseToken.status_code != 200 or 'eid' not in responseToken.json():
            raise ValueError("Error al iniciar sesión en la API")

        sid = responseToken.json()['eid']

        unidades = [int(id) for id in unidades_str.split(',')]
        datos_unidades = []

        for unidad in unidades:
            datos_unidad = {
                'Patente': '0',
                'Velocidad': 0,
                'FechaGPS': '0',
                'Latitud': 0,
                'Longitud': 0,
                'Curso': 0,
                'Altitud': 0,
                'Nombre Sensor': '0',
                'Oxigenacion': '0',
                'Fecha Dato': '0',
                'Valores': ['0']
            }

            try:
                argumentosUnidad = {'params':'{"id":' + f'{unidad}' + ',"flags":1}', "sid":sid}
                responseUnidad = requests.get(urlUnidad, params=argumentosUnidad)
                if responseUnidad.status_code == 200:
                    patente = responseUnidad.json().get('item', {}).get('nm', '0')
                    id_wialon = responseUnidad.json().get('item', {}).get('id', '0')

                    argumentosPosicion = {'params':'{"id":' + f'{unidad}' + ',"flags":4194304}', "sid":sid}
                    responsePosicion = requests.get(urlUnidad, params=argumentosPosicion)
                    if responsePosicion.status_code == 200:
                        datos = responsePosicion.json().get('item', {})
                        fechatms = datos.get("pos", {}).get("t", 0)

                        argumentosSensor = {'params':'{"id":' + f'{unidad}' + ',"flags":4096}', "sid":sid}
                        responseSensor = requests.get(urlUnidad, params=argumentosSensor)
                        sensores = responseSensor.json().get('item', {}) if responseSensor.status_code == 200 else {}

                        argumentosAcc = {'params':'{"id":' + f'{unidad}' + ',"flags":1048576}', "sid":sid}
                        responseAcc = requests.get(urlUnidad, params=argumentosAcc)
                        ignicion = responseAcc.json().get('item', {}) if responseAcc.status_code == 200 else {}

                        ahora = datetime.now()
                        horaGps = datetime.fromtimestamp(fechatms)
                        zonaHorariaLocal = pytz.timezone('America/Santiago')
                        horaGpsLocal = horaGps.replace(tzinfo=pytz.utc).astimezone(zonaHorariaLocal)
                        horaLocal = ahora.replace(tzinfo=pytz.utc).astimezone(zonaHorariaLocal)
                        
                        fechatms = datos.get("pos", {}).get("t", 0)
                        horaGpsLocal = convertir_a_hora_local(fechatms, 'America/Santiago')

                        cadena = ignicion.get("prms", {}).get("text", {}).get("v", "0")

                        datos_unidad.update({
                            'Patente': patente,
                            'Velocidad': datos.get("pos", {}).get("s", 0),
                            'FechaGPS': str(horaGpsLocal),
                            'Latitud': datos.get("pos", {}).get("y", 0),
                            'Longitud': datos.get("pos", {}).get("x", 0),
                            'Curso': datos.get("pos", {}).get("c", 0),
                            'Altitud': datos.get("pos", {}).get("z", 0),
                            'Nombre Sensor': sensores.get("sens", {}).get("1", {}).get("p", "0"),
                            'Oxigenacion': cadena,
                            'Fecha Dato': str(horaLocal),
                            'Valores': cadena.split(),
                            'idWialon': id_wialon,
                        })
            except Exception as e:
                print(f"Error con la unidad {unidad}: {e}")

            datos_unidades.append(datos_unidad)

        json_data = json.dumps(datos_unidades, indent=4)
        print(json_data)

    except Exception as e:
        print(f"Error general: {e}")

if __name__ == "__main__":
    main()
