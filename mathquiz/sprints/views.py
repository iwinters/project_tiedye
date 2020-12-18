from django.shortcuts import render, get_object_or_404
from .models import category,level
from users.models import student
import django.http.request
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.contrib.auth.models import User
from users.forms import PointsForm, StudentsForm, PlacementForm
from django.core import serializers



def sprint(request, student_id, level_id):
    unit = get_object_or_404(level, pk=level_id)
    student_object = get_object_or_404(student, pk=student_id)
    prev_points = student_object.points
    form=PointsForm(request.POST, instance = student_object)

    if request.method == 'POST':
        if form.is_valid():
            if (form.cleaned_data.get('points') - prev_points) >= 8:
                if unit.category_id == 1:
                    student_object.arithmetic_level = unit.id
                    student_object.save()
            form.save()
            return redirect ('tree', student_id = student_object.id)


    return render(request,'sprints/sprint.html', {'unit':unit, 'student':student_object, 'form': form}) 

def tree(request, student_id):
    count = 0
    terminator = False
    categories = category.objects.all()
    student_object = get_object_or_404(student, pk=student_id)
    points = student_object.points

    arithmetic_units = level.objects.filter(category = 1)
    arithmetic_level = student_object.arithmetic_level

    arithmetic_next_unit = int(student_object.arithmetic_level) + 1

    for unit in arithmetic_units:
        count += 1
        if unit.id == arithmetic_level:
            terminator = True
        elif terminator == True:
            arithmetic_level_display = count
            arithmetic_next_unit = unit.id
            break
        elif arithmetic_level == 0:
            arithmetic_level_display = 1
            arithmetic_next_unit = 1
        else:
            arithmetic_level_display = "Complete"
            arithmetic_next_unit = 1


    students = student.objects.filter(user = request.user)
    context={'student': student_object, 'categories':categories, 'arithmetic_next_unit': arithmetic_next_unit, 'students':students, 'points':points, "arithmetic_level_display": arithmetic_level_display}

    if request.user.id == student_object.user.id:
        return render(request,'sprints/tree.html', context)        
    else:
        return redirect('some_tree')

def placement(request, student_id, category_id):
    raw_cat_levels = level.objects.filter(category = category_id).exclude(sprint_type = "lesson")
    category_levels = serializers.serialize("json", raw_cat_levels)
    
    unit = get_object_or_404(category, pk=category_id)

    student_object = get_object_or_404(student, pk=student_id)

    form = PlacementForm(request.POST, instance = student_object)

    if request.method == 'POST':
        if form.is_valid():
            if unit.id == 1:
                student_object.arithmetic_level = form.cleaned_data.get('arithmetic_level')
                student_object.save()
            form.save()
            return redirect ('tree', student_id = student_object.id)
    
    context = {"category_levels": category_levels, "student": student_object, "form": form}

    return render(request, 'sprints/placement.html' , context)


def some_tree(request):
    if request.user.is_authenticated:
        students = student.objects.filter(user = request.user)
        if len(students) >= 1:
            one_student = students[0]
            response = redirect(reverse_lazy('tree', kwargs={"student_id": one_student.id}))
            return response
        else:
            return redirect('students')
    else:
        context = {}
        return render(request, 'sprints/index.html', context)

def students(request):
    if request.user.is_authenticated:
        form=StudentsForm(request.POST)
        if request.method == 'POST':
                if form.is_valid():
                    form.instance.user = request.user
                    form.save()
                    return redirect ('some_tree')


        context = {'form':form}
        return render(request, 'sprints/students.html', context)
    else:
        return render(request, 'sprints/index.html', context)

def about(request):
    context = {}
    return render(request, 'sprints/about.html', context)