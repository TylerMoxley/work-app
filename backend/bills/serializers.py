from rest_framework import serializers
from .models import RepairBill

class RepairBillSerializer(serializers.ModelSerializer):
    class Meta:
        model = RepairBill
        fields = '__all__'
