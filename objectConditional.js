let tipoDeSuscripcion = {
	Free: 'solo puedes tomar los cursos gratis',
	Basic: 'puedes tomar casi todos los cursos de Platzi durante un mes',
	Expert: 'puedes tomar casi todos los cursos de Platzi durante un año',
	ExpertPlus:
		'tú y alguien más pueden tomar TODOS los cursos de Platzi durante un año',
};

const suscripcion = "Basic"

Object.keys(tipoDeSuscripcion).find((plan) => {
  if (plan == suscripcion) {
    console.log(tipoDeSuscripcion[plan]);
  }
});