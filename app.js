document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('appointmentForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Obtener los valores del formulario
        const patientId = document.getElementById('patientId').value;
        const appointmentType = document.getElementById('appointmentType').value;
        const appointmentDate = document.getElementById('appointmentDate').value;
        const appointmentTime = document.getElementById('appointmentTime').value;
        const contact = document.getElementById('contact').value;

        // Crear el objeto Appointment en formato FHIR
        const appointment = {
            resourceType: "Appointment",
            status: "booked",
            type: {
                text: appointmentType
            },
            start: new Date(${appointmentDate}T${appointmentTime}:00).toISOString(),
            participant: [{
                actor: {
                    reference: Patient/${patientId}
                },
                status: "accepted"
            }],
            telecom: [{
                system: "phone",
                value: contact
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
            alert('Cita registrada exitosamente!');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Hubo un error al registrar la cita.');
        });
    });
});
