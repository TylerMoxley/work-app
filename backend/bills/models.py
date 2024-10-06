from django.db import models

class RepairBill(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('signed', 'Signed'),  # Add this line
        ('processed', 'Processed'),
        ('failed', 'Failed'),
        ('completed', 'Completed'),
    ]

    so_number = models.CharField(max_length=100)
    customer_name = models.CharField(max_length=255)
    model_number = models.CharField(max_length=255)
    serial_number = models.CharField(max_length=255)
    rma_number = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    failure_reason = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    envelope_id = models.CharField(max_length=100, blank=True, null=True)
    # customer_email = models.EmailField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.customer_name} - {self.so_number}"
