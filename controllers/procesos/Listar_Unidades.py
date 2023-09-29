from Obtener_unidades import unidades_hctec

import json

def main():
    token = '3aea5432fa86e4067492ad30c6fbe24e53F72405A071E085F9E5B7E8D030D08DFBB5477A'
    ids = unidades_hctec(token)
    
    # Guarda las unidades en una lista
    unidades_list = []
    for unidad in ids:
        unidades_list.append({"ID": unidad})
    
    # Convierte la lista a formato JSON
    unidades_json = json.dumps(unidades_list, indent=4)  # 'indent=4' hace que el JSON sea más legible
    print(unidades_json)

main()