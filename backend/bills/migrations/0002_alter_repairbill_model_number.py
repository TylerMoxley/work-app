# Generated by Django 4.2.16 on 2024-09-22 08:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bills', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='repairbill',
            name='model_number',
            field=models.CharField(choices=[('GCQ', 'GCQ'), ('GC3', 'GC3'), ('LP', 'LP'), ('GCH', 'GCH'), ('QuadMax', 'QuadMax'), ('FC', 'FC')], max_length=255),
        ),
    ]
