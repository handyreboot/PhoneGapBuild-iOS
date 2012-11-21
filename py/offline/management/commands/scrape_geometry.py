'''
Created on Jan 9, 2012

@author: bcollins
'''
from __future__ import division

import math
import sys
import traceback
import json
import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'wri_offline_viewer.settings'



from wri_offline_viewer.geoscraping.ags.agsserver import AGSServer, Folder
from optparse import make_option
from django.core.management.base import BaseCommand, CommandError
from wri_offline_viewer.geoscraping.models import Geometry

class Command(BaseCommand):
    
    option_list = BaseCommand.option_list + (
        make_option('--long', '-l', dest='long',
            help='Help for the long options'),
        make_option('--target', '-t', dest='targetServer',
                help='target geometry server'),
        make_option('--folder', '-f', dest='folderName',
                help='specific folder to scrape'),
        make_option('--maxAllowableOffsetLevel', '-m', dest='maxAllowableOffsetLevel',
                help='zoom level to use as basis for generalization.  If not provided, then no generalization occurs.')
    )
    
    help = 'Help text goes here'
    
    def handle(self,**options):
        self.scrapeGeometry(options['targetServer'], options['folderName'], options['maxAllowableOffsetLevel'])
        
    def scrapeGeometry(self, targetServer, folderName=None, maxAllowableOffsetLevel=None):
        
        print 'MAX OFFSET LEVEL:', maxAllowableOffsetLevel
        
        #Set Max Allowable Offset for Geometry Generalization
        if maxAllowableOffsetLevel:
            maxAllowableOffset = self.getWebMercatorMaxAllowableOffsetByLevel(maxAllowableOffsetLevel)
        else:
            maxAllowableOffset = 0
            
        print 'MAX OFFSET:', maxAllowableOffset
        
        #Set Folder name or path
        if folderName:
            folder = Folder().fromUrl('/'.join([targetServer, folderName]))
            services = folder.services
        else:
            server = AGSServer().fromUrl(targetServer)
            services = server.getAllServices()
    
        for s in services:
            if(s.type == 'MapServer'):
                print s.name
                for l in s.layers:
                    if(l.type == 'Feature Layer'):
                        try:
                            amfGeometry = l.query('1=1','amf', maxAllowableOffset)
                            jsonMetadata = l.json
                            geometry = Geometry(url=l.url, _geometry=amfGeometry, metadata=jsonMetadata)
                            geometry.save()
                        except:
                            self.debug()
                            raw_input('Error Occurred...')
                            sys.exit(0)
    
    def getWebMercatorMaxAllowableOffsetByLevel(self, zoomLevel):
        EARTH_CIRCUM = 2 * 3.14159265 * 6378137
        offset = EARTH_CIRCUM / (256 * math.pow(2, int(zoomLevel)))
        return offset
    
    def debug(self):
        '''reports python system related errors'''
        tb = sys.exc_info()[2]
        tbinfo = traceback.format_tb(tb)[0]
        pymsg = "PYTHON ERRORS:\nTraceback Info:\n"
        pymsg += tbinfo + "\n"
        pymsg += "Error Info:\n" + str(sys.exc_type) + ": "
        pymsg += str(sys.exc_value) + "\n"
        print pymsg


if __name__ == '__main__':
    
    SERVER = r'http://beowulf.cares.missouri.edu/ArcGIS/rest/services'
    
    cmd = Command()
    options = {}
    options['targetServer'] = SERVER
    options['targetServer'] = SERVER
    options['maxAllowableOffsetLevel'] = 10
    
    cmd.handle(**options)