import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      welcome: "Welcome to Hexagon Builder",
      login: "Login",
      register: "Register",
      username: "Username",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      home: "Home",
      dashboard: "Dashboard",
      game: "Game",
      logout: "Logout",
      cities: "Cities",
      createCity: "Create City",
      resources: "Resources",
      buildings: "Buildings",
      chat: "Chat",
      onlinePlayers: "Online Players",
      population: "Population",
      level: "Level",
      construction: "Construction",
      instructions: "Instructions",
      selectBuilding: "Select a building type from the list",
      placeBuilding: "Click on the hex grid to place it",
      buildingOptions: "Click on placed buildings for options",
      send: "Send",
      typeMessage: "Type your message...",
      upgrade: "Upgrade",
      repair: "Repair",
      demolish: "Demolish",
      currentCity: "Current City"
    }
  },
  ru: {
    translation: {
      welcome: "Добро пожаловать в Hexagon Builder",
      login: "Вход",
      register: "Регистрация",
      username: "Имя пользователя",
      email: "Электронная почта",
      password: "Пароль",
      confirmPassword: "Подтвердить пароль",
      home: "Главная",
      dashboard: "Панель управления",
      game: "Игра",
      logout: "Выход",
      cities: "Города",
      createCity: "Создать город",
      resources: "Ресурсы",
      buildings: "Здания",
      chat: "Чат",
      onlinePlayers: "Онлайн игроки",
      population: "Население",
      level: "Уровень",
      construction: "Строительство",
      instructions: "Инструкции",
      selectBuilding: "Выберите тип здания из списка",
      placeBuilding: "Нажмите на шестиугольную сетку, чтобы разместить его",
      buildingOptions: "Нажмите на размещенное здание для получения опций",
      send: "Отправить",
      typeMessage: "Введите ваше сообщение...",
      upgrade: "Улучшить",
      repair: "Ремонт",
      demolish: "Снести",
      currentCity: "Текущий город"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;