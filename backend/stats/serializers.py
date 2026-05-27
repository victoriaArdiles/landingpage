from rest_framework import serializers
from .models import ProgramStats

class ProgramStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramStats
        fields = ['pacientes_atendidos', 'medicos_aliados', 'centros_de_salud', 'municipios', 'updated_at']
