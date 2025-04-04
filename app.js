document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const status = document.getElementById('status').value; // ej: 'booked'
    const start = document.getElementById('start').value; // formato ISO 8601: "2025-04-04T15:00:00Z"
    const end = document.getElementById('end').value;
    const patientId = document.getElementById('patientId').value; // ID del paciente FHIR
    const practitionerId = document.getElementById('practitionerId').value; // ID del médico
    const reason = document.getElementById('reason').value;

    // Crear el objeto Appointment en formato FHIR
    const appointment = {
        resourceType: "Appointment",
        status: status,
        start: start,
        end: end,
        reasonCode: [{
            text: reason
        }],
        participant: [
            {
                actor: {
                    reference: `Patient/${patientId}`
                },
                status: "accepted"
            },
            {
                actor: {
                    reference: `Practitioner/${practitionerId}`
                },
                status: "accepted"
            }
        ]
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
