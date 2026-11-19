$(document).ready(function () {
    var TOTAL = 10;

    var DIFFICULTIES = {
        1: { name: 'Початковий', hint: 'повсякденні слова', maxLevel: 2 },
        2: { name: 'Середній',   hint: 'ширша лексика',     maxLevel: 3 },
        3: { name: 'Високий',    hint: 'складні слова',     maxLevel: 4 }
    };

    var DICTIONARY = {
        1: [
            { en: 'always', ua: ['завжди'] },
            { en: 'never',  ua: ['ніколи'] },
            { en: 'house',  ua: ['дім', 'будинок', 'хата'] },
            { en: 'water',  ua: ['вода'] },
            { en: 'friend', ua: ['друг', 'приятель', 'подруга'] },
            { en: 'book',   ua: ['книга', 'книжка'] },
            { en: 'apple',  ua: ['яблуко'] },
            { en: 'sun',    ua: ['сонце'] },
            { en: 'school', ua: ['школа'] },
            { en: 'dog',    ua: ['собака', 'пес'] },
            { en: 'cat',    ua: ['кіт', 'кішка', 'котик'] },
            { en: 'tree',   ua: ['дерево'] },
            { en: 'table',  ua: ['стіл'] },
            { en: 'bread',  ua: ['хліб'] },
            { en: 'night',  ua: ['ніч'] }
        ],
        2: [
            { en: 'window',    ua: ['вікно'] },
            { en: 'street',    ua: ['вулиця'] },
            { en: 'city',      ua: ['місто'] },
            { en: 'happy',     ua: ['щасливий', 'радісний', 'щаслива'] },
            { en: 'beautiful', ua: ['гарний', 'красивий', 'прекрасний', 'гарна', 'красива'] },
            { en: 'weather',   ua: ['погода'] },
            { en: 'journey',   ua: ['подорож', 'мандрівка'] },
            { en: 'forest',    ua: ['ліс'] },
            { en: 'tired',     ua: ['втомлений', 'стомлений', 'втомлена'] },
            { en: 'answer',    ua: ['відповідь', 'відповідати'] },
            { en: 'strong',    ua: ['сильний', 'міцний', 'потужний'] },
            { en: 'remember',  ua: ["пам'ятати", 'згадати', 'пригадати'] },
            { en: 'believe',   ua: ['вірити', 'повірити', 'вірувати'] },
            { en: 'between',   ua: ['між', 'поміж'] },
            { en: 'surprise',  ua: ['сюрприз', 'подив', 'здивування', 'несподіванка'] }
        ],
        3: [
            { en: 'achievement', ua: ['досягнення', 'здобуток'] },
            { en: 'ambiguous',   ua: ['двозначний', 'неоднозначний'] },
            { en: 'reluctant',   ua: ['неохочий', 'небажаючий'] },
            { en: 'inevitable',  ua: ['неминучий', 'невідворотний'] },
            { en: 'sustainable', ua: ['сталий', 'стійкий', 'стабільний'] },
            { en: 'consequence', ua: ['наслідок', 'наслідки', 'результат'] },
            { en: 'guarantee',   ua: ['гарантія', 'гарантувати', 'запорука'] },
            { en: 'negotiate',   ua: ['домовлятися', 'домовитися', 'вести переговори'] },
            { en: 'prejudice',   ua: ['упередження', 'упередженість', 'забобон'] },
            { en: 'thorough',    ua: ['ретельний', 'ґрунтовний', 'докладний', 'детальний'] },
            { en: 'reliable',    ua: ['надійний', 'достовірний'] },
            { en: 'obstacle',    ua: ['перешкода', 'завада', 'перепона'] },
            { en: 'eager',       ua: ['нетерплячий', 'палкий', 'завзятий', 'охочий'] },
            { en: 'reveal',      ua: ['розкривати', 'розкрити', 'виявляти', 'виявити', 'відкривати'] },
            { en: 'feasible',    ua: ['здійсненний', 'реальний', 'можливий', 'досяжний'] }
        ]
    };

    var LEVELS = [
        { min: 0,  code: 'A1', name: 'Початковий',      text: 'Тільки початок шляху. Повторіть слова та спробуйте ще раз!' },
        { min: 30, code: 'A2', name: 'Базовий',         text: 'Є база, але слів потрібно вивчити більше.' },
        { min: 50, code: 'B1', name: 'Середній',        text: 'Непогано. Базова лексика засвоєна, продовжуйте практику.' },
        { min: 70, code: 'B2', name: 'Вище середнього', text: 'Дуже добре! Лишилось підтягнути кілька слів.' },
        { min: 90, code: 'C1', name: 'Просунутий',      text: 'Чудовий результат! Ви впевнено володієте лексикою.' }
    ];

    var UA_REGEXP = /^[а-щьюяєіїґ' -]+$/;

    var $card       = $('#card');
    var $word       = $('#word');
    var $feedback   = $('#feedback');
    var $step       = $('#step');
    var $prev       = $('#prev');
    var $next       = $('#next');
    var $form       = $('#answer-form');
    var $answer     = $('#answer');
    var $error      = $('#error');
    var $ok         = $('#stat-ok');
    var $bad        = $('#stat-bad');
    var $modal      = $('#modal');
    var $levelsList = $('#levels-list');
    var $radios;    

    var difficulty = 1; 
    var words = [];     
    var current = 0;  

    function buildLevelSelector() {
        $.each(DIFFICULTIES, function (id, d) {
            var $input = $('<input>', {
                type: 'radio',
                name: 'difficulty',
                value: id,
                'class': 'level__input',
                checked: String(id) === String(difficulty)
            });
            var $text = $('<span>').text(d.name)
                .append($('<small>', { 'class': 'level__hint', text: d.hint }));

            $('<label>', { 'class': 'level' })
                .append($input, $text)
                .appendTo($levelsList);
        });
        $radios = $levelsList.find('input[name="difficulty"]');
    }

    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        return a;
    }

    function normalize(str) {
        return $.trim(str)
            .toLowerCase()
            .replace(/[’ʼ`‘]/g, "'")
            .replace(/\s+/g, ' ');
    }

    function validate(value) {
        if (value === '') {
            return 'Введіть переклад слова.';
        }
        if (!UA_REGEXP.test(value)) {
            return 'Дозволені лише українські літери, пробіл, дефіс та апостроф.';
        }
        if (value.replace(/[' -]/g, '') === '') {
            return 'Переклад має містити літери.';
        }
        return '';
    }

    function showError(message) {
        $answer.addClass('is-invalid').attr('aria-invalid', 'true');
        $error.stop(true, true).text(message).fadeIn(150);
    }

    function hideError() {
        $answer.removeClass('is-invalid').removeAttr('aria-invalid');
        $error.stop(true, true).hide().text('');
    }

    function countAnswered() {
        return $.grep(words, function (w) { return w.answered; }).length;
    }

    function countCorrect() {
        return $.grep(words, function (w) { return w.answered && w.correct; }).length;
    }

    function hasProgress() {
        var answered = countAnswered();
        return answered > 0 && answered < words.length;
    }

    function render() {
        var w = words[current];

        $word.text(w.en);
        $step.text((current + 1) + '/' + words.length);

        $card
            .removeClass('is-correct is-wrong')
            .toggleClass('is-correct', w.answered && w.correct)
            .toggleClass('is-wrong', w.answered && !w.correct);

        if (!w.answered) {
            $feedback.text('');
        } else if (w.correct) {
            $feedback.text('Вірно!');
        } else {
            $feedback.text('Невірно. Правильно: ' + w.ua[0]);
        }

        hideError();
        $answer
            .val(w.answered ? w.userAnswer : (w.draft || ''))
            .prop('disabled', w.answered);

        $prev.prop('disabled', current === 0);
        $next.prop('disabled', current === words.length - 1);

        var okCount = countCorrect();
        $ok.text(okCount);
        $bad.text(countAnswered() - okCount);
    }

    function go(direction) {
        var target = current + direction;
        if (target < 0 || target >= words.length) {
            return;
        }
        words[current].draft = $answer.val();
        current = target;

        $card.stop(true, true).fadeTo(120, 0, function () {
            render();
            $card.fadeTo(120, 1);
            if (!words[current].answered && window.matchMedia('(hover: hover)').matches) {
                $answer.trigger('focus');
            }
        });
    }

    function checkAnswer() {
        var w = words[current];
        if (w.answered) {
            return;
        }

        var value = normalize($answer.val());
        var message = validate(value);
        if (message) {
            showError(message);
            $answer.trigger('focus');
            return;
        }

        w.userAnswer = $.trim($answer.val());
        w.correct = $.inArray(value, w.ua) !== -1;
        w.answered = true;
        render();

        if (countAnswered() === words.length) {
            setTimeout(showResult, 900);
        }
    }

    function getLevel(percent) {
        var index = 0;
        $.each(LEVELS, function (i, level) {
            if (percent >= level.min) {
                index = i;
            }
        });
        var capped = Math.min(index, DIFFICULTIES[difficulty].maxLevel);
        return { level: LEVELS[capped], isCapped: capped < index };
    }

    function showResult() {
        var total = words.length;
        var correct = countCorrect();
        var percent = Math.round(correct / total * 100);
        var result = getLevel(percent);
        var text = result.level.text;

        if (result.isCapped) {
            text += ' Щоб отримати вищий рівень, оберіть більшу складність.';
        }

        $('#modal-level').text(result.level.code);
        $('#modal-name').text(result.level.name);
        $('#modal-score').text('Вірно: ' + correct + ' з ' + total + ' (' + percent + '%)');
        $('#modal-difficulty').text('Складність: ' + DIFFICULTIES[difficulty].name);
        $('#modal-text').text(text);

        $('body').addClass('modal-open');
        $modal.attr('aria-hidden', 'false').css('display', 'flex').hide().fadeIn(250);
        $('#modal-restart').trigger('focus');
    }

    function closeModal() {
        $modal.fadeOut(200).attr('aria-hidden', 'true');
        $('body').removeClass('modal-open');
    }


    function start() {
        words = $.map(shuffle(DICTIONARY[difficulty]).slice(0, TOTAL), function (item) {
            return {
                en: item.en,
                ua: item.ua,
                answered: false,
                correct: false,
                userAnswer: '',
                draft: ''
            };
        });
        current = 0;
        $card.stop(true, true).css('opacity', 1);
        render();
    }

    $levelsList.on('change', 'input[name="difficulty"]', function () {
        var chosen = $radios.filter(':checked').val();

        if (hasProgress() &&
            !window.confirm('Зміна складності розпочне тест спочатку, поточний прогрес буде втрачено. Продовжити?')) {
            $radios.filter('[value="' + difficulty + '"]').prop('checked', true);
            return;
        }

        difficulty = chosen;
        start();
    });

    $card.on('click', checkAnswer);

    $card.on('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            checkAnswer();
        }
    });

    $form.on('submit', function (e) {
        e.preventDefault();
        checkAnswer();
    });

    $answer.on('input', hideError);

    $prev.on('click', function () { go(-1); });
    $next.on('click', function () { go(1); });

    $('#restart, #modal-restart').on('click', function () {
        closeModal();
        start();
    });

    $('#modal-close').on('click', closeModal);

    $modal.on('click', function (e) {
        if (e.target === this) {
            closeModal();
        }
    });

    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && $modal.is(':visible')) {
            closeModal();
        }
    });

    buildLevelSelector();
    start();
});
