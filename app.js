document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('appointmentForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Obtener los valores del formulario
        const patientId = document.getElementById('patientId').value;
        const appointmentType = document.getElementById('appointmentType').value;
        const appointmentDate = document.getElementById('appointmentDate').value;
        const appointmentTime = document.getElementById('appointmentTime').value;
        const contact = document.getElementById('contact').value;

        // Validación rápida
        if (!patientId || !appointmentType || !appointmentDate || !appointmentTime || !contact) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        // Crear el objeto Appointment en formato HL7 FHIR
        const appointment = {
            resourceType: "Appointment",
            status: "booked",
            type: {
                text: appointmentType
            },
            start: new Date(`${appointmentDate}T${appointmentTime}:00`).toISOString(),
            participant: [{
                actor: {
                    reference: `Patient/${patientId}`
                },
                status: "accepted"
            }],
            telecom: [{
                system: "phone",
                value: contact
            }]
        };

        // Enviar el objeto con Fetch API
        fetch('https://hl7-fhir-ehr-ana-006.onrender.com/appointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointment)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al registrar la cita');
            }
            return response.json();
        })
        .then(data => {
            console.log('Éxito:', data);
            alert('¡Cita registrada exitosamente!');
            form.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al registrar la cita.');
        });
    });
});
