document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const patientId = document.getElementById('patientId').value;
    const patientName = document.getElementById('patientName').value; 
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
    const pad = n => n.toString().padStart(2, '0');
    // Crear fecha/hora en local manualmente con el offset colombiano
    const startDateTime = `${appointmentDate}T${appointmentTime}:00-05:00`;
   
    const localDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    const end = new Date(localDateTime.getTime() + 30 * 60000);
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
                    display: patientName
                },
                status: "accepted"
            },
            
        ],
       
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
