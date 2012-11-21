'''
Created on Jun 6, 2012

@author: bcollins
'''

import sys
import os
import traceback
import json
import csv

from decimal import Decimal

os.environ['DJANGO_SETTINGS_MODULE'] = 'wri_offline_viewer.settings'

sys.path.append(r'C:\python_working_directory\GeoScrape\src\wri_offline_viewer')

from wri_offline_viewer import settings
from django.core.management import setup_environ
setup_environ(settings)

from optparse import make_option
from django.core.management.base import BaseCommand, CommandError
from wri_offline_viewer.geoscraping.models import Config

class Command(BaseCommand):
    
    
    def handle(self,**options):
        from wri_offline_viewer.geoscraping.models import CountryExtent

        CSV_PATH = r'C:\python_working_directory\GeoScrape\src\wri_offline_viewer\geoscraping\assets\extents\Country_Extents_Web_Mercator.csv'
        
        csv_file = open(CSV_PATH)
        reader = csv.reader(csv_file, dialect='excel')
        reader.next() # Skip header line.
        
        for row in reader:
            name = str(row[0])
            region = str(row[1])
            code = str(row[2])
            xmin = Decimal(row[3])
            ymin = Decimal(row[4])
            xmax = Decimal(row[5])
            ymax = Decimal(row[6])
            
            CountryExtent.objects.get_or_create(name=name,region=region,code=code,xmin=xmin,ymin=ymin,xmax=xmax,ymax=ymax,wkid='102100')
        
        print name
        
        csv_file.close()
    
    