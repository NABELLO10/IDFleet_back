import requests
import json
from datetime import datetime
import pytz
import sys

def obtener_datos_api(url, params):
    try:
        response = requests.get(url, params=params)
        if response.status_code == 200:
            return response.json()
        else:
            return None
    except requests.RequestException as e:
        print(f"Error de solicitud: {e}")
        return None
    
def convertir_a_hora_local(timestamp, zona_horaria_str):
    zona_horaria = pytz.timezone(zona_horaria_str)
    fecha_utc = datetime.utcfromtimestamp(timestamp).replace(tzinfo=pytz.utc)
    fecha_local = fecha_utc.astimezone(zona_horaria)
    return fecha_local.strftime('%Y-%m-%d %H:%M:%S')

def main():
    urlInicio = 'https://hst-api.wialon.com/wialon/ajax.html?svc=token/login'
    urlUnidad = 'https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_item'
    token = sys.argv[1]
    unidades_str = sys.argv[2]
    sid = None

    respuestaToken = obtener_datos_api(urlInicio, {'params': json.dumps({"token": token, "fl": 1})})
    if respuestaToken and 'eid' in respuestaToken:
        sid = respuestaToken['eid']
    else:
        raise ValueError("No se pudo obtener el SID de la API.")

    unidades = [int(id) for id in unidades_str.split(',')]
    datos_unidades = []


    for unidad in unidades:
        datos_unidad = {
            'Patente': '0', 'Velocidad': 0, 'FechaGPS': '0', 'Latitud': 0, 'Longitud': 0, 
            'Curso': 0, 'Altitud': 0
        }

        paramsUnidad = {'params': json.dumps({"id": unidad, "flags": 1}), "sid": sid}
        unidad_data = obtener_datos_api(urlUnidad, paramsUnidad)
        if unidad_data and 'item' in unidad_data:
            item = unidad_data['item']
            datos_unidad['Patente'] = item.get('nm', '0')
            id_wialon = item.get('id', '0')

            paramsPosicion = {'params': json.dumps({"id": unidad, "flags": 4194304}), "sid": sid}
            posicion_data = obtener_datos_api(urlUnidad, paramsPosicion)
            if posicion_data and 'item' in posicion_data:
                pos = posicion_data['item'].get('pos')
                if pos and 't' in pos:
                    timestamp = pos['t']                   
                    fecha_gps_local = convertir_a_hora_local(timestamp, 'America/Santiago')
                    datos_unidad.update({
                        'FechaGPS': fecha_gps_local,
                        'Latitud': pos.get('y', 0),
                        'Longitud': pos.get('x', 0),
                        'Curso': pos.get('c', 0),
                        'Altitud': pos.get('z', 0),
                        'Velocidad': pos.get('s', 0),
                        'idWialon': id_wialon
                    })
                else:
                    datos_unidad['FechaGPS'] = 'Fecha no disponible'

            datos_unidades.append(datos_unidad)

    json_data = json.dumps(datos_unidades, indent=4)
    print(json_data)

if __name__ == "__main__":
    main()
