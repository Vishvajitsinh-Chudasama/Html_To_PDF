from django.shortcuts import render
import requests
import pdfkit
from django.http import HttpResponse

# Create your views here.
def home(request):
    if request.method == "GET":
        return render(request,'home.html')
    elif request.method == "POST":
        uploaded_file = request.FILES.get('file')
        if not uploaded_file:
            return HttpResponse("No file uploaded", status=400)

        html_content = uploaded_file.read().decode('utf-8')

        # Convert HTML string to PDF bytes
        pdf_bytes = pdfkit.from_string(html_content, False)

        response = HttpResponse(pdf_bytes, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="output.pdf"'
        return response
    else:
        return HttpResponse("Method not allowed", status=405)