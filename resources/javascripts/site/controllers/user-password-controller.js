angular
    .module('Realza')
    .controller('UserPasswordController', ['api', 'growl', UserPasswordController]);

function UserPasswordController(api, growl) {

    var $this = this;

    $this.init = function () {
        console.log('Init UserPasswordController');
        $this.item = {};
    };

    $this.save = function () {

        if (!$this.item.currentPassword || !$this.item.newPassword || !$this.item.newPasswordConfirmation) {
            return growl.warning('Все поля обязательны к заполнению');
        }

        if ($this.item.newPassword !== $this.item.newPasswordConfirmation) {
            return growl.warning('Введенные пароли не совпадают');
        }

        api.post('/user/setting/password', $this.item, function (err) {
            if (!err) {
                growl.success('Пароль успешно изменен');
                $this.item = {};
            }
        });
    };
}