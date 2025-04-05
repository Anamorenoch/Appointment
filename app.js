document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const patientId = document.getElementById('patientId').value;
    const appointmentDate = document.getElementById('appointmentDate').value;
    const appointmentTime = document.getElementById('appointmentTime').value;
    const contactPhone = document.getElementById('contactPhone').value;
    const appointmentType = document.getElementById('appointmentType').value;

    // Validar que la hora esté entre 08:00 y 20:00
    const [hour, minute] = appointmentTime.split(':').map(Number);
    if (hour < 8 || hour >= 20) {
        alert('La hora debe estar entre las 08:00 y las 20:00');
        return;
    }

    // Construir fecha y hora de inicio y fin (30 min después)
    const startDateTime = `${appointmentDate}T${appointmentTime}:00-05:00`;

    // Calcular la hora de fin
    const start = new Date(`${appointmentDate}T${appointmentTime}`);
    const end = new Date(start.getTime() + 30 * 60000); // +30 minutos
    const pad = n => n.toString().padStart(2, '0');
    const endDateTime = `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}T${pad(end.getHours())}:${pad(end.getMinutes())}:00-05:00`;

    // Crear el objeto Appointment en formato FHIR
    const appointment = {
        resourceType: "Appointment",
        status: "booked",
        start: startDateTime,
        end: endDateTime,
        participant: [
            {
                actor: {
                    reference: `Patient/${patientId}`,
                    display: "Nombre del paciente"
                },
                status: "accepted"
            },
            {
                actor: {
                    reference: "Practitioner/example-practitioner",
                    display: "Dra. María Gómez"
                },
                status: "accepted"
            },
            {
                actor: {
                    reference: "Location/example-location",
                    display: "Consultorio Central - Piso 2"
                },
                status: "accepted"
            }
        ],
        reasonCode: [
            {
                text: appointmentType
            }
        ],
        // Se incluye 'telecom' solo si tu servidor acepta ese campo en Appointment
        // Si no, se puede omitir o mover a otro recurso relacionado como Patient o Practitioner
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
