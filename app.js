document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const status = document.getElementById('status').value;
    const patientReference = document.getElementById('patientReference').value;
    const practitionerReference = document.getElementById('practitionerReference').value;
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;
    const reasonCode = document.getElementById('reasonCode').value;
    const reasonDisplay = document.getElementById('reasonDisplay').value;

    // Crear el objeto Appointment en formato FHIR
    const appointment = {
        resourceType: "Appointment",
        status: status,
        participant: [
            {
                actor: {
                    reference: "Patient/" + patientReference
                },
                status: "accepted"
            },
            {
                actor: {
                    reference: "Practitioner/" + practitionerReference
                },
                status: "accepted"
            }
        ],
        start: start,
        end: end,
        reasonCode: [{
            coding: [{
                system: "http://snomed.info/sct",
                code: reasonCode,
                display: reasonDisplay
            }],
            text: reasonDisplay
        }]
    };

    // Enviar los datos usando Fetch API
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
        alert('Cita creada exitosamente!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un error al crear la cita.');
    });
});
