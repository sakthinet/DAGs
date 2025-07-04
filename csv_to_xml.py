from airflow import DAG
from airflow.decorators import task
from datetime import datetime
import csv, os
import xml.etree.ElementTree as ET

# Configurable paths
input_file_path = r'/opt/airflow/data/AcmeCorp_tabledata.csv'
output_directory = r'/opt/airflow/data/'

default_args = {
    "owner": "airflow",
    "retries": 1,
}

with DAG(
    dag_id='CSV_TO_XML_FOR_ARCHIVING',
    default_args=default_args,
    description='Dynamically process CSV and convert each row to XML',
    schedule=None,
    start_date=datetime(2024, 1, 1),
    catchup=False,
) as dag:

    @task
    def validate_csv_path():
        if not os.path.isfile(input_file_path):
            raise FileNotFoundError(f"❌ File not found: {input_file_path}")
        print(f"✅ File located at: {input_file_path}")

    @task
    def stream_and_export_xml():
        os.makedirs(output_directory, exist_ok=True)
        base_name = os.path.splitext(os.path.basename(input_file_path))[0]
        output_file = os.path.join(output_directory, f"{base_name}.xml")

        print(f"🔁 Streaming CSV and converting to XML: {output_file}")

        # Create XML structure
        root = ET.Element('DATA')  # Generic root tag

        with open(input_file_path, mode='r', encoding='utf-8', newline='') as csvfile:
            reader = csv.DictReader(csvfile)

            for i, row in enumerate(reader, start=1):
                row_elem = ET.SubElement(root, 'ROW')
                for key, val in row.items():
                    child = ET.SubElement(row_elem, key.strip().replace(' ', '_'))
                    child.text = str(val) if val else ''

                if i % 10000 == 0:
                    print(f"📥 Processed {i} records...")

        # Final write
        ET.ElementTree(root).write(output_file, encoding='utf-8', xml_declaration=True)
        print(f"✅ XML file saved to: {output_file}")

    # DAG task chaining
    validate_csv_path() >> stream_and_export_xml()
