angular
    .module('Realza')
    .controller('UserEmailController', ['api', 'growl', '$scope', UserEmailController]);

function UserEmailController(api, growl, $scope) {

    var $this = this;

    $this.init = function (item) {
        console.log('Init email controller' + item);

        $this.pendingEmail = item;

        $this.item = {};

        setTimeout(function () {
            $scope.$apply()
        }, 10);
    };

    $this.save = function () {

        if (!$this.item.currentEmail || !$this.item.newEmail) {
            return growl.warning('Все поля обязательны к заполнению');
        }

        if ($this.item.currentEmail === $this.item.newEmail) {
            return growl.warning('Нельзя вводить одинаковые E-mail адреса');
        }

        api.post('/user/setting/email', $this.item, function (err) {
            if (!err) {
                $this.pendingEmail = true;
                growl.success('Вас высланы письма, пройдите по ссылкам в них для подтерждения');
            }
        });
    };
}