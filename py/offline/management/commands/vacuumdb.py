'''
Created on Jan 10, 2012

@author: bcollins
'''
from django.core.management.base import NoArgsCommand
from django.db import transaction, connections

class Command(NoArgsCommand):
    help = "Print a cliche to the console."
    
    def handle_noargs(self, **options):
        print "Hello, World!"
    
    def vacuum_db(self):
        cursor = connections[using].cursor()
        cursor.execute("VACUUM")
        transaction.set_dirty(using=using)
        