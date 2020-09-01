from django.shortcuts import render, get_object_or_404
from .models import category,level


def sprint(request, level_id):
    unit = get_object_or_404(level, pk=level_id)
    return render(request,'sprints/sprint.html', {'unit':unit}) 

def tree(request):
    context={}
    return render(request,'sprints/tree.html', context)