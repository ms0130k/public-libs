      setupCompleteDateInput('ibcalendarBefore', {
        rangeIds: ['ibcalendarBefore', 'ibcalendarAfter'],
        onSuccess: console.log,
      });
      setupCompleteDateInput('ibcalendarAfter', {
        rangeIds: ['ibcalendarBefore', 'ibcalendarAfter'],
        onSuccess: console.log,
      });
      function setupStrictDateInput(inputId, { rangeIds = [] } = {}) {
        const input = document.getElementById(inputId);

        input.setAttribute('maxlength', '10');
        input.placeholder = 'yyyymmdd';

        input.addEventListener('input', () => {
          let val = input.value.replace(/\D/g, '');

          if (val.length > 8) {
            val = val.slice(0, 8); // 8자 이상 못 입력하게 잘라냄
          }

          if (val.length >= 1 && !/[1-9]/.test(val[0])) {
            val = '';
          }

          if (rangeIds && rangeIds.length === 2) {
            const startId = rangeIds[0];
            const endId = rangeIds[1];

            if (inputId === startId) {
              const endValue = document.getElementById(endId).value.replace(/\D/g, '');
              const compareValue = endValue.substring(0, val.length);
              if (isValidDate(endValue) && val > compareValue) {
                val = val.substring(0, val.length - 1);
              }
            } else {
              const startValue = document.getElementById(startId).value.replace(/\D/g, '');
              const compareValue = startValue.substring(0, val.length);
              if (isValidDate(startValue) && val < compareValue) {
                val = val.substring(0, val.length - 1);
              }
            }
          }

          if (val.length >= 6) {
            const month = parseInt(val.slice(4, 6), 10);
            if (month < 1 || month > 12) {
              val = val.slice(0, 4);
            }
          }

          if (val.length === 8 && !isValidDate(val)) {
            val = val.slice(0, 7);
          }

          input.value = val;
        });
      }

      function setupDateFormatOnFocusBlur(
        inputId,
        {
          format = 'yyyy-MM-dd',
          onSuccess = null,
          onInvalid = (value, input) => {
            alert('유효하지 않은 날짜입니다.');
            input.value = '';
          },
        } = {}
      ) {
        const input = document.getElementById(inputId);

        input.addEventListener('focus', () => {
          input.value = input.value.replace(/\D/g, '');
        });

        input.addEventListener('blur', () => {
          const raw = input.value.replace(/\D/g, '');
          if (raw.length === 0) {
            input.value = '';
            return;
          }
          if (raw.length !== 8 || !isValidDate(raw)) {
            onInvalid(raw, input); // 유효하지 않은 날짜 콜백 호출
            return;
          }
          const y = parseInt(raw.slice(0, 4), 10);
          const m = parseInt(raw.slice(4, 6), 10);
          const d = parseInt(raw.slice(6, 8), 10);
          const date = new Date(y, m - 1, d);

          const formatted = IBSheet.dateToString(date.getTime(), format); // yyyy-MM-dd 형식으로 변환
          input.value = formatted;

          if (onSuccess) {
            onSuccess(formatted, input); // 성공 콜백 호출
            //TODO 필요할까?
          }
        });
      }

      function isValidDate(yyyymmdd) {
        if (!/^\d{8}$/.test(yyyymmdd)) return false;
        const y = parseInt(yyyymmdd.slice(0, 4), 10);
        const m = parseInt(yyyymmdd.slice(4, 6), 10);
        const d = parseInt(yyyymmdd.slice(6, 8), 10);
        const date = new Date(y, m - 1, d);
        return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
      }

      function setupCompleteDateInput(inputId, { rangeIds = [], format = 'yyyy-MM-dd', onSuccess, onInvalid } = {}) {
        setupStrictDateInput(inputId, { rangeIds });
        setupDateFormatOnFocusBlur(inputId, {
          format: format,
          onSuccess: onSuccess,
          onInvalid,
        });
      }
