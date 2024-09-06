from rest_framework import viewsets
from .models import RepairBill
from .serializers import RepairBillSerializer

class RepairBillViewSet(viewsets.ModelViewSet):
    queryset = RepairBill.objects.all()
    serializer_class = RepairBillSerializer

    def get_queryset(self):
        status = self.request.query_params.get('status', None)
        if status:
            return self.queryset.filter(status=status)
        return self.queryset
