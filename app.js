document.getElementById('appointmentForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const patientId = document.getElementById('patientId').value;
    const patientName = document.getElementById('patientName').value; 
    const appointmentDate = document.getElementById('appointmentDate').value;
    const appointmentTime = document.getElementById('appointmentTime').value;
    const contactPhone = document.getElementById('contactPhone').value;
    const appointmentType = document.getElementById('appointmentType').value;

    // Validar que la fecha no sea hoy ni anterior
    const selectedDate = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignorar hora para comparar solo fechas
    if (selectedDate <= today) {
        alert('No se pueden programar citas para hoy ni días anteriores.');
        return;
    }

    // Validar que la hora esté entre 08:00 y 20:00
    const [hour, minute] = appointmentTime.split(':').map(Number);
    if (hour < 8 || hour >= 20) {
        alert('La hora debe estar entre las 08:00 y las 20:00');
        return;
    }

    // Verificar si el paciente existe en la base de datos por identificador
    const system = "http://cedula";
    const queryUrl = `https://hl7-fhir-ehr-ana-006.onrender.com/patient?system=${encodeURIComponent(system)}&value=${encodeURIComponent(patientId)}`;

    try {
        const checkResponse = await fetch(queryUrl);

        if (checkResponse.status === 204) {
            alert('Paciente no registrado. Por favor verifique el ID.');
            return;
        }

        if (!checkResponse.ok) {
            throw new Error(`Error del servidor: ${checkResponse.status}`);
        }

        const data = await checkResponse.json();
        if (!data || Object.keys(data).length === 0) {
            alert('Paciente no registrado. Por favor verifique el ID.');
            return;
        }

    } catch (error) {
        console.error('Error al verificar paciente:', error);
        alert('Error al verificar el paciente. Inténtelo más tarde.');
        return;
    }

    // Calcular hora de inicio y fin
    const pad = n => n.toString().padStart(2, '0');
    const startDateTime = `${appointmentDate}T${appointmentTime}:00-05:00`;

    let endHour = hour;
    let endMinute = minute + 30;
    if (endMinute >= 60) {
        endMinute -= 60;
        endHour += 1;
    }
    const endDateTime = `${appointmentDate}T${pad(endHour)}:${pad(endMinute)}:00-05:00`;

    // Crear el objeto Appointment (NO modificado como pediste)
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
            }
        ]
    };

    // Enviar el Appointment al servidor
    fetch('https://hl7-fhir-ehr-ana-006.onrender.com/appointment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointment)
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 409) {
                alert('Ya hay una cita agendada en esa hora. Por favor elige otra.');
                throw new Error("Cita duplicada");
            }
            throw new Error(`Error del servidor: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('Cita creada exitosamente!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un error al crear la cita.');
    });
