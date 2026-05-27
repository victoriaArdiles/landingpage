from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ProgramStats
from .serializers import ProgramStatsSerializer

@api_view(['GET'])
def get_stats(request):
    """Returns the single ProgramStats row (creates default values if none exist)."""
    stats, _ = ProgramStats.objects.get_or_create(
        id=1,
        defaults={
            'pacientes_atendidos': 12500,
            'medicos_aliados': 500,
            'centros_de_salud': 184,
            'municipios': 37,
        }
    )
    serializer = ProgramStatsSerializer(stats)
    return Response(serializer.data)
