angular
    .module('Realza')
    .controller('UserSettingController', ['api', 'growl', UserSettingController]);

function UserSettingController(api, growl) {

    var $this = this;

    $this.init = function (item) {
        console.log('Init setting controller', item);
        $this.item = item;

        if ($this.item.image) {
            $this.image = $this.item.image.cdnUrl;
        } else {
            $this.image = '/images/user/default-avatar-min.jpg';
        }
    };

    $this.imageUploaderOptions = {
        change: function (file) {
            $this.imageUploading = true;
            file.$upload('/user/setting/upload-image', {}, {allowedType: ['jpeg', 'jpg', 'png']})
                .then(function (data) {
                    $this.imageUploading = false;
                    $this.image          = data.data.cdnUrl;
                    $this.item.image     = data.data;
                })
                .catch(function (data) {
                    $this.imageUploading = false;
                    console.error(data);
                });
        },
        fieldName: 'file'
    };

    $this.removeUserImage = function () {
        api.get('/user/setting/delete-image', function (err) {
            if (!err) {
                $this.item.image = null;
                $this.image = '/images/user/default-avatar-min.jpg';
            }
        });
    };

    $this.save = function () {

        if (!$this.item.firstName || !$this.item.phone) {
            return growl.warning('Заполните обязательный поля');
        }

        api.post('/user/setting/profile', $this.item, function (err) {
            if (!err) {
                growl.success('Личная информация сохранена');
            }
        });
    };

}
