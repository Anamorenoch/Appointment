document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('appointmentForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const patientId = document.getElementById('patientId').value;
        const appointmentType = document.getElementById('appointmentType').value;
        const appointmentDate = document.getElementById('appointmentDate').value;
        const appointmentTime = document.getElementById('appointmentTime').value;
        const contact = document.getElementById('contact').value;

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

        console.log("Datos enviados:", appointment); // ← útil para verificar

        fetch('https://hl7-fhir-ehr-ana-006.onrender.com/appointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointment)
        })
        .then(response => {
            if (!response.ok) throw new Error("Error HTTP: " + response.status);
            return response.json();
        })
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
