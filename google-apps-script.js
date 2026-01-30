/**
 * Google Apps Script для записи заявок в Google Sheets
 *
 * ИНСТРУКЦИЯ ПО УСТАНОВКЕ:
 *
 * 1. Создайте новый Google Sheet (sheets.google.com)
 *
 * 2. Добавьте заголовки в первую строку:
 *    A1: Дата/Время
 *    B1: Имя
 *    C1: Телефон
 *    D1: Источник
 *
 * 3. Откройте Extensions > Apps Script
 *
 * 4. Удалите весь код и вставьте код ниже
 *
 * 5. Сохраните проект (Ctrl+S)
 *
 * 6. Нажмите Deploy > New deployment
 *
 * 7. Выберите тип: Web app
 *
 * 8. Настройки:
 *    - Description: Form Handler
 *    - Execute as: Me
 *    - Who has access: Anyone
 *
 * 9. Нажмите Deploy
 *
 * 10. Разрешите доступ к Google Sheets
 *
 * 11. Скопируйте Web app URL
 *
 * 12. Вставьте URL в файл scripts/main.js в переменную GOOGLE_SCRIPT_URL
 *
 * ВАЖНО: При изменении кода нужно создать новый deployment!
 */

// ID вашей Google таблицы (из URL: https://docs.google.com/spreadsheets/d/SHEET_ID/edit)
const SHEET_ID = "YOUR_SHEET_ID_HERE";

// Название листа
const SHEET_NAME = "Заявки";

/**
 * Обработчик POST запросов
 */
function doPost(e) {
  try {
    // Получаем данные из запроса
    const data = JSON.parse(e.postData.contents);

    // Открываем таблицу
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

    // Если лист не найден, создаем его
    if (!sheet) {
      const ss = SpreadsheetApp.openById(SHEET_ID);
      const newSheet = ss.insertSheet(SHEET_NAME);
      newSheet.appendRow(["Дата/Время", "Имя", "Телефон", "Источник"]);
      sheet = newSheet;
    }

    // Форматируем дату
    const timestamp = data.timestamp
      ? new Date(data.timestamp).toLocaleString("ru-RU", {
          timeZone: "Asia/Bishkek",
        })
      : new Date().toLocaleString("ru-RU", { timeZone: "Asia/Bishkek" });

    // Добавляем строку с данными
    sheet.appendRow([
      timestamp,
      data.name || "",
      data.phone || "",
      data.source || "",
    ]);

    // Возвращаем успешный ответ
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: "Data saved" }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Возвращаем ошибку
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.message }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Обработчик GET запросов (для тестирования)
 */
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "ok",
      message: "APEX Academy Form Handler is running",
      timestamp: new Date().toISOString(),
    }),
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Тестовая функция (запустите вручную для проверки)
 */
function testFormSubmission() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        name: "Тест Тестов",
        phone: "+996 555 123456",
        timestamp: new Date().toISOString(),
        source: "https://example.com/test",
      }),
    },
  };

  const result = doPost(testData);
  Logger.log(result.getContent());
}

/**
 * АЛЬТЕРНАТИВНЫЙ СПОСОБ - ИСПОЛЬЗОВАНИЕ GOOGLE FORMS
 *
 * Если не хотите использовать Apps Script, можете:
 *
 * 1. Создать Google Form с полями "Имя" и "Телефон"
 * 2. Связать форму с Google Sheet
 * 3. Получить prefilled URL формы
 * 4. Отправлять данные через этот URL
 *
 * Пример в main.js:
 *
 * const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/FORM_ID/formResponse';
 *
 * fetch(GOOGLE_FORM_URL, {
 *   method: 'POST',
 *   mode: 'no-cors',
 *   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
 *   body: `entry.NAME_FIELD_ID=${encodeURIComponent(name)}&entry.PHONE_FIELD_ID=${encodeURIComponent(phone)}`
 * });
 */
