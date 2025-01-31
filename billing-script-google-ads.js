var CONFIG = {
  days : 1,
     email : ['mail@mail.com', 'mail@mail.com'],
  names : ['Billing Script'],
  }
  function main () {
  
     var accountName = AdWordsApp.currentAccount().getName();
  var budgets = AdWordsApp.budgetOrders().withCondition('Status = ACTIVE').get();
     
       try {
         var budget = budgets.next();
         if (budget.getSpendingLimit() !== null ) {
           var startDate = timeFormat(budget.getStartDateTime());
           var cost = AdWordsApp.currentAccount().getStatsFor(startDate,today()).getCost();
           var last7DaysCostByDay = (AdWordsApp.currentAccount().getStatsFor("LAST_7_DAYS").getCost() / 7).toFixed();
           var limit = budget.getSpendingLimit();
           var remainingDays = rDays(limit, cost, last7DaysCostByDay);
           var budgetNow = (limit - cost).toFixed();
           if (budgetNow < 0) {
             var budgetNow = 0;
           }
           else {
             var budgetNow = budgetNow;
           }
           Logger.log([accountName, budgetNow, last7DaysCostByDay, remainingDays]);
           if (remainingDays < CONFIG.days) {
             sendTelegramMessage('Аккаунт ' + accountName + ' . Текущий остаток = ' + budgetNow + '. Расход в день = ' + last7DaysCostByDay +
                                 ' . Денег хватит на ' + remainingDays + ' дня/дней.');
             MailApp.sendEmail(CONFIG.email,
                             CONFIG.names +' / Заканчивается бюджет на аккаунте: ' + accountName,
                             'Аккаунт ' + accountName + ' . Текущий остаток = ' + budgetNow +
                             '. Расход в день = ' + last7DaysCostByDay + ' в валюте аккаунта. ' +
                             'Денег хватит на ' + remainingDays + ' дня/дней. В аккаунте заканчиваются средства. Необходимо предупредить PM.');
           }
         }
       }
       catch (e) {
         Logger.log(e);
         sendTelegramMessage('Ошибка выполнения скрипта контроль Бюджетов ' + accountName);
         MailApp.sendEmail(CONFIG.email,
                           'Ошибка выполнения скрипта Контроль бюджетов',
                           'Необходимо проверить работу скрипта Контроль бюджетов ' + accountName + ' ' + e);
       }
     
  }
  function timeFormat (date) {
   var year = date.year.toString();
   var month = date.month.toString();
   var day = date.day.toString();
   if (month.length == 1) {
     month = "0" + month;
   }
   if (day.length == 1) {
     day = "0" + day;
   }
   return [year, month, day].join("");
  }
  function today () {
   var date = new Date();
   var timeZone = AdWordsApp.currentAccount().getTimeZone();
   var format = 'yyyyMMdd';
   return Utilities.formatDate(date, timeZone, format);
  }
  function rDays(limit, cost, last7DaysCostByDay) {
   var remainingDays = ((limit - cost) / last7DaysCostByDay).toFixed();
   if (remainingDays < 1 || remainingDays == "Infinity" || remainingDays == "-Infinity" || remainingDays == -0 ) {
     remainingDays = 0;
   }
   return remainingDays;
  }
  function sendTelegramMessage(text) {
  var CONFIG2 = {
  TOKEN: 'your tokken',
  CHAT_ID: 'id',
  CHAT_ID: 'id'
  };
  var telegramUrl = 'https://api.telegram.org/bot' + CONFIG2.TOKEN + '/sendMessage?chat_id=' + CONFIG2.CHAT_ID + '&text=';
  var message = encodeURIComponent(text);
  var sendMessageUrl = telegramUrl + message;
  var options = {
  method: 'POST',
  contentType: 'application/json'
  };
  UrlFetchApp.fetch(sendMessageUrl, options);
  }