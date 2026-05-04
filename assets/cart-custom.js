document.addEventListener('DOMContentLoaded', () => {
  const debounceTimers = {};
  const debounceDelay = 400;

  const disableControls = (key) => {
    const container = document.querySelector(`.product-container[data-key="${key}"]`);
    if (!container) return;

    container.querySelectorAll('.quantity-increase, .quantity-decrease, .quantity-input').forEach((el) => {
      el.setAttribute('disabled', 'true');
      el.style.pointerEvents = 'none';
      el.style.opacity = '0.6';
    });
  };

  const enableControls = (key) => {
    const container = document.querySelector(`.product-container[data-key="${key}"]`);
    if (!container) return;

    container.querySelectorAll('.quantity-increase, .quantity-decrease, .quantity-input').forEach((el) => {
      el.removeAttribute('disabled');
      el.style.pointerEvents = '';
      el.style.opacity = '';
    });
  };

  const updateCart = (updates, callback) => {
    const key = Object.keys(updates)[0];

    disableControls(key);
    addLoadingIndicators();

    fetch('/cart/update.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (callback) callback(data);
      })
      .catch((err) => console.error('Cart update error:', err))
      .finally(() => {
        setTimeout(() => {
          removeLoadingIndicators();
          enableControls(key);
        }, 300);
      });
  };

  const refreshCartDOM = () => {
    fetch(`/cart?sections=cart`)
      .then((res) => res.json())
      .then((data) => {
        const html = data.cart;
        const container = document.createElement('div');
        container.innerHTML = html;

        const newCartForm = container.querySelector('#cart-form');
        const oldCartForm = document.querySelector('#cart-form');

        if (newCartForm && oldCartForm) {
          oldCartForm.replaceWith(newCartForm);
          rebindCartEvents();
        }

        removeLoadingIndicators();
      })
      .catch((err) => console.error('Cart refresh error:', err));
  };

  const addLoadingIndicators = () => {
    document.querySelectorAll('.total-price, .cart-subtotal, .cart-discount, .checkout-total .total').forEach((el) => {
      el.classList.add('loading');
    });
  };

  const removeLoadingIndicators = () => {
    document.querySelectorAll('.total-price, .cart-subtotal, .cart-discount, .checkout-total .total').forEach((el) => {
      el.classList.remove('loading');
    });
  };

  const rebindCartEvents = () => {
    document.querySelectorAll('.product-container').forEach((container) => {
      const key = container.dataset.key;
      const input = container.querySelector(`.quantity-input[data-key="${key}"]`);
      const plus = container.querySelector(`.quantity-increase[data-key="${key}"]`);
      const minus = container.querySelector(`.quantity-decrease[data-key="${key}"]`);
      const removeBtn = container.querySelector(`.remove-item[data-key="${key}"]`);

      const triggerDebouncedUpdate = () => {
        clearTimeout(debounceTimers[key]);
        debounceTimers[key] = setTimeout(() => {
          const finalQty = parseInt(input.value);
          if (!isNaN(finalQty) && finalQty > 0) {
            updateCart({ [key]: finalQty }, refreshCartDOM);
          }
        }, debounceDelay);
      };

      plus?.addEventListener('click', () => {
        let qty = parseInt(input.value) || 1;
        if (qty < 99999) {
          input.value = ++qty;
          triggerDebouncedUpdate();
        }
      });

      minus?.addEventListener('click', () => {
        let qty = parseInt(input.value) || 1;
        input.value = Math.max(1, --qty);
        triggerDebouncedUpdate();
      });

      input?.addEventListener('input', () => {
        let val = parseInt(input.value);
        if (isNaN(val) || val < 1) {
          input.value = 1;
        } else if (val > 99999) {
          input.value = 99999;
        }
        triggerDebouncedUpdate();
      });

      removeBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        updateCart({ [key]: 0 }, refreshCartDOM);
      });
    });
  };

  rebindCartEvents();
});
