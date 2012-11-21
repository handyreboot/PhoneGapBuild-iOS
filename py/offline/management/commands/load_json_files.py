'''
Created on Jun 6, 2012

@author: bcollins
'''

import sys
import os
import traceback
import json
import os.path
import time

os.environ['DJANGO_SETTINGS_MODULE'] = 'py.settings'

sys.path.append(r'C:\javascript_working_directory\2265-mobile-measure-dhs\py')

from py import settings
from django.core.management import setup_environ
setup_environ(settings)

from optparse import make_option
from django.core.management.base import BaseCommand, CommandError
from offline.models import JsonResource

class Command(BaseCommand):
    option_list = BaseCommand.option_list + ( make_option('--jsonFolder', '-f', dest='jsonFolder', help='loads json table'), )

    def handle(self,**options):
        self.loadConfigs(options['jsonFolder'])

    def loadConfigs(self, folderPath):

        json_files = os.listdir(folderPath)

        file_objects = []
        for f in json_files:
            if not f.endswith('.json') or f == 'data-update.json':
                continue

            path = os.path.join(folderPath, f)
            print f
            print path

            j = {}
            j['url'] = f
            j['name'] = f
            j['version'] = str(time.ctime(os.path.getmtime(path)))

            path = os.path.join(folderPath, f)
            config_file = open(path, 'r')
            json_data = config_file.read()
            JsonResource.objects.get_or_create(url=j['url'], json=json_data, version=j['version'], name=j['name'])
            config_file.close()

            file_objects.append(j)

        data_update_object = {'files':file_objects}
        data_update_file_path = path = os.path.join(folderPath, 'data-update.json')
        data_update_file = open(data_update_file_path, 'wb')
        data_update_file.write(json.dumps(data_update_object, sort_keys=True, indent=4))
        data_update_file.close()
    