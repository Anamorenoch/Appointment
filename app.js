document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const patientReference = document.getElementById('patientReference').value;
    const patientName = document.getElementById('patientName').value;

    const practitionerReference = document.getElementById('practitionerReference').value;
    const practitionerName = document.getElementById('practitionerName').value;

    const locationReference = document.getElementById('locationReference').value;
    const locationDisplay = document.getElementById('locationDisplay').value;

    const appointmentTypeCode = document.getElementById('appointmentType').value;
    const appointmentTypeDisplay = document.getElementById('appointmentType').selectedOptions[0].text;

    const serviceCategoryCode = document.getElementById('serviceCategory').value;
    const serviceCategoryDisplay = document.getElementById('serviceCategory').selectedOptions[0].text;

    const serviceTypeCode = document.getElementById('serviceType').value;
    const serviceTypeDisplay = document.getElementById('serviceType').selectedOptions[0].text;

    const specialtyCode = document.getElementById('specialty').value;
    const specialtyDisplay = document.getElementById('specialty').selectedOptions[0].text;

    const reasonReference = document.getElementById('reasonReference').value;
    const reasonDisplay = document.getElementById('reasonDisplay').value;

    const description = document.getElementById('description').value;
    const notes = document.getElementById('notes').value;

    const appointmentDate = document.getElementById('appointmentDate').value;
    const appointmentStartTime = document.getElementById('appointmentStartTime').value;
    const appointmentEndTime = document.getElementById('appointmentEndTime').value;

    // Fechas en formato ISO
    const start = new Date(`${appointmentDate}T${appointmentStartTime}:00`).toISOString();
    const end = new Date(`${appointmentDate}T${appointmentEndTime}:00`).toISOString();
    const created = new Date().toISOString().split('T')[0]; // solo la fecha

    // Crear el objeto Appointment en formato HL7 FHIR
    const appointment = {
        resourceType: "Appointment",
        status: "booked",
        serviceCategory: [{
            coding: [{
                system: "http://example.org/service-category",
                code: serviceCategoryCode,
                display: serviceCategoryDisplay
            }]
        }],
        serviceType: [{
            concept: {
                coding: [{
                    code: serviceTypeCode,
                    display: serviceTypeDisplay
                }]
            }
        }],
        specialty: [{
            coding: [{
                system: "http://snomed.info/sct",
                code: specialtyCode,
                display: specialtyDisplay
            }]
        }],
        appointmentType: {
            coding: [{
                system: "http://terminology.hl7.org/CodeSystem/v2-0276",
                code: appointmentTypeCode,
                display: appointmentTypeDisplay
            }]
        },
        reason: [{
            reference: {
                reference: reasonReference,
                display: reasonDisplay
            }
        }],
        description: description,
        start: start,
        end: end,
        created: created,
        note: [{
            text: notes
        }],
        participant: [
            {
                actor: {
                    reference: patientReference,
                    display: patientName
                },
                required: true,
                status: "accepted"
            },
            {
                actor: {
                    reference: practitionerReference,
                    display: practitionerName
                },
                required: true,
                status: "accepted"
            },
            {
                actor: {
                    reference: locationReference,
                    display: locationDisplay
                },
                required: true,
                status: "accepted"
            }
        ]
    };

    // Enviar los datos al servidor
    fetch('https://hl7-fhir-ehr-ana-006.onrender.com/appointment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointment)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('¡Cita registrada exitosamente!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un error al registrar la cita.');
    });
});
