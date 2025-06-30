from airflow import DAG
from airflow.decorators import task
from airflow.providers.standard.operators.python import PythonOperator
from datetime import datetime
import csv, os
import xml.etree.ElementTree as ET

csv_path = '/opt/airflow/data/AcmeCorp_tabledata.csv'

default_args = {
    "owner": "airflow",
    "retries": 1,
}

with DAG(
    dag_id='csv_to_xml_ticket_export',
    default_args=default_args,
    schedule=None,
    catchup=False,
) as dag:
    
    
    @task
    def convert_csv_to_xml():
        filename = os.path.basename(csv_path)
        customer_name = filename.split('_')[0]

        with open(csv_path, newline='') as f:
            reader = csv.DictReader(f)
            tickets = ET.Element('TICKETS')
            customer = ET.SubElement(tickets, customer_name)

            for row in reader:
                row_elem = ET.SubElement(customer, 'ROW')
                for key, val in row.items():
                    col = ET.SubElement(row_elem, key)
                    col.text = val

        output_path = f'/opt/airflow/data/{customer_name}_tabledata.xml'
        ET.ElementTree(tickets).write(output_path)
        print(f'✅ XML saved to: {output_path}')

    convert_csv_to_xml()
