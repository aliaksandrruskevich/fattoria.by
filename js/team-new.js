// Функция для загрузки данных сотрудников из Bitrix24
async function loadTeamDataFromBitrix() {
    try {
        const response = await fetch('/api/employees');
        if (!response.ok) {
            throw new Error('Failed to fetch employees');
        }
        const employees = await response.json();
        return employees.map(employee => ({
            name: `${employee.NAME} ${employee.LAST_NAME}`,
            position: employee.WORK_POSITION || "Сотрудник",
            photo: employee.PERSONAL_PHOTO ? `https://b24-7f121e.bitrix24.by${employee.PERSONAL_PHOTO}` : "images/team/placeholder-" + employee.NAME,
            rating: "5.0",
            reviews: "0",
            experience: "Опыт работы в компании",
            profile: "#",
            phone: employee.WORK_PHONE || employee.PERSONAL_MOBILE || "",
            telegram: "#",
            viber: employee.PERSONAL_MOBILE ? `viber://chat?number=${employee.PERSONAL_MOBILE.replace(/\D/g, '')}` : "#",
            specialization: "Недвижимость",
            regions: "Минск и область",
            about: `Сотрудник компании. Контактный телефон: ${employee.WORK_PHONE || employee.PERSONAL_MOBILE || 'Не указан'}`
        }));
    } catch (error) {
        console.error('Error loading team data from Bitrix:', error);
        // Fallback to static data if Bitrix fails
        return getStaticTeamData();
    }
}

// Статические данные сотрудников (резерв)
function getStaticTeamData() {
    return [
        {
            name: "Александр Рускевич",
            position: "Агент по недвижимости",
            photo: "images/team/sotR1.jpg",
            rating: "4.66",
            reviews: "6",
            experience: "2 года",
            profile: "https://realt.by/realtors/person/798358/",
            phone: "+375296380053",
            telegram: "https://t.me/fattoriaminsk",
            viber: "viber://chat?number=%2B375296380053",
            specialization: "Квартиры, комнаты – продажа, Коттеджи, дома, участки – продажа",
            regions: "г. Минск",
            about: "Специализация\n\nКвартиры, комнаты – продажа, Коттеджи, дома, участки – продажа\n\nОбо мне\n\nБесплатный подбор квартир от застройщиков в Минске и Минском районе\n\n\nЗапутались в многообразии новостроек?\n\n\nНе знаете, как выбрать оптимальный вариант и избежать переплат?\n\n\n Хотите получить достоверную информацию о ликвидности объекта и перспективах развития района?\n\n\nМы готовы помочь! Бесплатный подбор – без комиссий и скрытых платежей\n\n\nАктуальные предложения – работаем напрямую с застройщиками\n\n\nПрофессиональная консультация – анализ рынка, оценка выгодных условий и специальных акций\n\n\nИндивидуальный подход – подберем квартиру с учетом вашего бюджета и требований\n\n\nНе упустите выгодную возможность. Звоните по указанному номеру и получите консультацию от специалиста с опытом работы на рынке недвижимости.\n\n\nСделайте правильный выбор уже сегодня!"
        },
        {
            name: "Инна Баронова",
            position: "Агент по недвижимости",
            photo: "images/team/sotIn1.jpg",
            rating: "5",
            reviews: "22",
            experience: "5 лет",
            profile: "https://realt.by/realtors/person/544023/",
            phone: "+375291234567",
            telegram: "https://t.me/example",
            viber: "viber://chat?number=%2B375291234567",
            specialization: "Квартиры, комнаты – продажа, Квартиры, комнаты – аренда, Коттеджи, дома, участки – продажа, Новостройки, долевое строительство, Vip-недвижимость",
            regions: "г. Минск",
            about: "АН Фаттория\n\nОбразование: коммерческое психологическое\n\nСпециализация\n\nКвартиры, комнаты – продажа, Квартиры, комнаты – аренда, Коттеджи, дома, участки – продажа, Новостройки, долевое строительство, Vip-недвижимость\n\nОбо мне\n\nДипломированный психолог, опыт работы в сфере услуг 28 лет\n\n\nЯ нахожу идеальные решения для каждого клиента, создаю комфортные условия для сделок, где каждая сторона услышана и уверена в своем выборе!\n\n\nПомогаю принять решение выгодное для вас , не боюсь ответственности, легко нахожу общий язык с людьми разных характеров и взглядов\n\n\nКлиентоориентированна, все сделки со мной проходят прозрачно, комфортно и легко!\n\n\nМоя работа - создать долгосрочные отношения, основанные на доверии и результатах!\n\n\nДоверив свои вопросы мне - вы получите не только желаемый объект, но и прятные эмоции от процесса!"
        },
        {
            name: "Татьяна Юшко",
            position: "Риэлтер",
            photo: "images/team/sotYu1.jpg",
            rating: "5",
            reviews: "10",
            experience: "4 года",
            profile: "https://realt.by/realtors/person/415896/",
            phone: "+375296690982",
            telegram: "https://t.me/example",
            viber: "viber://chat?number=%2B375296690982",
            specialization: "Квартиры, комнаты – продажа, Коттеджи, дома, участки – продажа, Коммерческая недвижимость – продажа, Новостройки, долевое строительство, Vip-недвижимость",
            regions: "Минск / Заводской район, Минск / Ленинский район, Минск / Московский район, Минск / Октябрьский район, Минск / Партизанский район, Минск / Первомайский район, Минск / Советский район, Минск / Фрунзенский район, Минск / Центральный район, г. Жодино, г. Воложин, г. Дзержинск, г. Заславль, г. Логойск, г. Смолевичи, Воложинский район, Минский район",
            about: "АН Фаттория\n\nОбразование: Белорусский Государственный Экономический Университет\n\nЯ говорю на языках: Русский\n\nИдентификационная карточка №: АВ0025915\n\nСпециализация\n\nКвартиры, комнаты – продажа, Коттеджи, дома, участки – продажа, Коммерческая недвижимость – продажа, Новостройки, долевое строительство, Vip-недвижимость"
        },
        {
            name: "Федорчук Светлана Анатольевна",
            position: "Риелтор",
            photo: "images/team/fedor1.jpg",
            rating: "5",
            reviews: "45",
            experience: "5 лет",
            profile: "https://realt.by/realtors/person/256124/",
            phone: "+375291119090",
            telegram: "https://t.me/+375291119090",
            viber: "viber://chat?number=%2B375291119090",
            specialization: "продажа квартир и домов в Минске и минской области",
            regions: "Минск и минская область",
            about: "Моя работа – консультировать своих клиентов и совершать выгодные операции с недвижимостью. Знаю, как работает рынок и знаю, как достичь цели. Самой важной цели – Вашей! Позвоните мне и получите квалифицированную консультацию!"
        },
        {
            name: "Юлия Горегляд",
            position: "Риелтор",
            photo: "images/team/placeholder-Юлия",
            rating: "5",
            reviews: "0",
            experience: "Новичок",
            profile: "https://realt.by/realtors/profile/",
            phone: "+375296202820",
            telegram: "https://t.me/example",
            viber: "viber://chat?number=%2B375296202820",
            specialization: "продажа и покупка недвижимости",
            regions: "Минск",
            about: "Недвижимость: продажа и покупка. Комплексное сопровождение сделок. Профессиональные консультации. Надежно. Быстро. Выгодно."
        },
        {
            name: "Супко Кристина Владимировна",
            position: "Риэлтер, юрист",
            photo: "images/team/placeholder-Кристина",
            rating: "5",
            reviews: "0",
            experience: "4 года",
            profile: "https://realt.by/realtors/profile/",
            phone: "+375336660699",
            telegram: "https://t.me/example",
            viber: "viber://chat?number=%2B375336660699",
            specialization: "Жилая недвижимость, юридическое сопровождение",
            regions: "Минск",
            about: "Риэлтер, юрист, имею высшее юридическое образование. Работаю в сфере недвижимости с 2020 года. Постоянно повышаю свою квалификацию и знания. Имею большой опыт работы по всем объектам недвижимости, но приоритет жилая недвижимость. Рада помочь людям в решении их вопросов по недвижимости. К работе подхожу с душой. Подтверждение тому многочисленные благодарные клиенты, которые с чистой совестью рекомендуют меня своим друзьям и знакомым. Буду рада вам помочь в решении Ваших жилищных вопросов!"
        },
        {
            name: "Игорь Цукров",
            position: "Агент по недвижимости, Агент по операциям с недвижимостью",
            photo: "images/team/sotR1.jpg",
            rating: "5",
            reviews: "5",
            experience: "3 года",
            profile: "https://realt.by/realtors/person/718653/",
            phone: "+375336636882",
            telegram: "https://t.me/+375336636882",
            viber: "viber://chat?number=%2B375336636882",
            specialization: "Квартиры, комнаты – продажа, Коттеджи, дома, участки – продажа, Новостройки, долевое строительство",
            regions: "г. Минск, г. Молодечно, г. Слуцк, г. Солигорск, г. Дзержинск, г. Заславль, г. Марьина Горка, г. Несвиж, г. Столбцы, Борисовский район, Молодечненский район, Несвижский район, Слуцкий район, Солигорский район, Столбцовский район, Минская область",
            about: "Меня зовут Игорь, я агент по операциям с недвижимостью в компании Фаттория + , которая является победителем Международной бизнес-премии «Номер Один» 2025 в номинации «Агентство недвижимости №1».\n\nГотов помочь вам в решении жилищного вопроса любой сложности! Помогу с выгодой продажей и покупкой самых различных объектов недвижимости!\nВсегда отстаиваю интересы своих клиентов, как свои собственные!\nНахожусь на связи 24/7!\nОплата услуг только по факту!\n\nПредпочитаю уделять максимальное количество времени рабочему процессу, и постоянно быть на связи, чтобы выполнить свои обязанности на самом высоком уровне. Поэтому, значительная часть клиентов приходит ко мне по отличным рекомендациям!\n\nОбращайтесь, буду рад помочь!"
        },
    ];
}

// Глобальная переменная для данных сотрудников
let teamData = [];

// Функция для загрузки данных сотрудников с логированием и проверками
function loadTeamData() {
    console.log("loadTeamData started");
    const teamGrid = document.getElementById("teamGrid");
    const loadingIndicator = document.getElementById("loadingIndicator");
    
    if (!teamGrid) {
        console.error("Элемент с id 'teamGrid' не найден");
        return;
    }
    
    if (!loadingIndicator) {
        console.warn("Элемент с id 'loadingIndicator' не найден");
    } else {
        loadingIndicator.style.display = "none";
        console.log("loadingIndicator скрыт");
    }
    
    teamGrid.innerHTML = "";
    
    teamData.forEach((member, index) => {
        const memberElement = document.createElement("div");
        memberElement.classList.add("team-member");
        memberElement.setAttribute("data-aos", "fade-up");
        memberElement.setAttribute("data-aos-delay", index * 100);
        
        memberElement.innerHTML = `
            <img src="${member.photo}" class="team-member-img" alt="${member.name}">
            <div class="team-member-info">
                <h3 class="team-member-name">${member.name}</h3>
                <p class="team-member-position">${member.position}</p>
                <div class="team-member-rating">
                    <i class="fas fa-star"></i> ${member.rating} (${member.reviews} отзывов)
                </div>
                <p class="team-member-specialization">${member.specialization}</p>
                <button class="btn btn-outline-primary btn-sm">Подробнее</button>
            </div>
        `;
        
        memberElement.addEventListener('click', () => openMemberModal(member));
        teamGrid.appendChild(memberElement);
    });
    console.log("loadTeamData finished");
}

// Функция для открытия модального окна с информацией о сотруднике с логами
function openMemberModal(member) {
    console.log("openMemberModal called for", member.name);
    const modal = document.getElementById('teamMemberModal');
    if (!modal) {
        console.error("Модальное окно с id 'teamMemberModal' не найдено");
        return;
    }
    
    document.getElementById("modalAgentName").textContent = member.name;
    document.getElementById("modalAgentPosition").textContent = member.position;
    document.getElementById("modalAgentPhoto").src = member.photo;
    document.getElementById("modalAgentExperience").textContent = member.experience;
    document.getElementById("modalAgentRating").textContent = member.rating;
    document.getElementById("modalAgentReviews").textContent = member.reviews;
    document.getElementById("modalAgentAbout").textContent = member.about;
    document.getElementById("modalAgentSpecialization").textContent = member.specialization;
    document.getElementById("modalAgentRegions").textContent = member.regions;
    document.getElementById("modalAgentPhone").textContent = member.phone;
    
    document.getElementById("modalAgentWhatsApp").href = `https://wa.me/${member.phone.replace(/\D/g, '')}`;
    document.getElementById("modalAgentTelegram").href = member.telegram;
    document.getElementById("modalAgentViber").href = member.viber;
    document.getElementById("modalAgentProfile").href = member.profile;
    
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    console.log("Модальное окно открыто для", member.name);
}

// Асинхронная функция для инициализации данных сотрудников
// Асинхронная функция для инициализации данных сотрудников
async function initializeTeamData() {
    console.log("Using static team data");
    teamData = getStaticTeamData();
    loadTeamData();
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded event fired");
    initializeTeamData();
});
