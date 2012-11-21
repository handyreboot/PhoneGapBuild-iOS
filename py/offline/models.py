from django.db import models

# Create your models here.
class JsonResource(models.Model):
    url = models.CharField(max_length=1028, unique=True, db_index=True)
    name = models.CharField(max_length=256, unique=True, db_index=True)
    json = models.TextField()
    version = models.TextField()