import conditions from './conditions.js';

console.log('conditions', conditions);

const form = document.querySelector('.form');
const inputCity = document.querySelector('input');
const header = document.querySelector('.header');
let city;

async function getWeather(city) {
	const apiKey = '2cfb09f361ce4d6ab61160439241404';
	const query = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
	const response = await fetch(query);
	const data = await response.json();

	console.log('data', data);
	return data;
}

const createCard = ({ city, country, temp, condition, imgPath }) => {
	const html = `
			<div class="card">
				<h2 class="card-city">${city} <span>${country}</span></h2>

				<div class="card-weather">
						<div class="card-value">${temp}<sup>°c</sup></div>
						<img
							class="card-img"
							src="${imgPath}"
							alt="Weather"
						/>
					</div>

					<div class="card-description">${condition}</div>
			</div>`;

	header.insertAdjacentHTML('afterend', html);
};

const removeCard = () => {
	const prevCard = document.querySelector('.card');
	if (prevCard) prevCard.remove();
};

const showError = errMessage => {
	if (inputCity.value === '') {
		const htmlEmpty = `<div class="card">Enter the correct name of the city.</div>`;
		header.insertAdjacentHTML('afterend', htmlEmpty);
	} else {
		const html = `<div class="card">${errMessage}</div>`;
		header.insertAdjacentHTML('afterend', html);
	}
};

async function getInfoAboutCity(e) {
	//cancel form submit
	e.preventDefault();

	city = inputCity.value.trim();

	//receive dates from server
	const data = await getWeather(city);

	//check on errors
	if (data.error) {
		removeCard();

		//card with error
		showError(data.error.message);
	} else {
		//delete card
		removeCard();

		console.log('data.current.condition.code', data.current.condition.code);
		const info = conditions.find(
			obj => obj.code === data.current.condition.code
		);

		//icons for weather
		const filePath =
			'./distribution/img/' + (data.current.is_day ? 'day' : 'night') + '/';
		const fileName = (data.current.is_day ? info.day : info.night) + '.png';
		const imgPath = filePath + fileName;

		const Weather = {
			city: data.location.name,
			country: data.location.country,
			temp: Math.round(data.current.temp_c),
			condition: data.current.is_day
				? info.languages[19]['day_text']
				: info.languages[19]['night_text'],
			imgPath: imgPath,
		};

		//card HTML
		createCard(Weather);
	}
}

form.addEventListener('submit', getInfoAboutCity);
