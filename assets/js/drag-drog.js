const dropAreaSelector = '.filedrop-box';
const fileInputSelector = '#upload-file';
const fileWrapperSelector = '#filewrapper'; 
const initialBox = `.input-bx`;
const globalFiles = [];
class FileDropHandler {
    constructor(dropAreaSelector, fileInputSelector, fileWrapperSelector, initialBox) {
        this.dropArea = $(dropAreaSelector);
        this.fileInput = $(fileInputSelector);
        this.fileWrapper = $(fileWrapperSelector);
        this.initialBox = $(initialBox);
        this.init();
    }

    init() {
        this.fileInput.val('');

        // Buttun Upload
        document.querySelector('#btnUpload').addEventListener('click', () => { this.hendleUploadFile(); });

        this.dropArea.on('dragenter dragover dragleave drop', (e) => {
            e.preventDefault();
            this.initialBox.addClass('active');
            e.stopPropagation();
        });

        // Efek visual saat area di-drag
        ['dragenter', 'dragover'].forEach(eventName => {
            this.dropArea.on(eventName, () => {
                this.dropArea.addClass('highlight');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            this.dropArea.on(eventName, () => {
                this.dropArea.removeClass('highlight');
            });
        });

        // Penanganan saat file di-drop
        this.dropArea.on('drop', (e) => {
            e.preventDefault();
            const files = e.originalEvent.dataTransfer.files;
            this.handleFiles(files);
        });

        // Penanganan saat file dipilih melalui input file
        this.fileInput.on('change', () => {
            const files = this.fileInput[0].files;
            this.handleFiles(files);
        });

        this.fileWrapper.on('click', '.delete-file', (e) => {
            const index = $(e.currentTarget).closest('.showfilebox').data('index');
            $(e.currentTarget).closest('.showfilebox').remove();
            this.removeFileAtIndex(index);
        });
        
    }

    handleFiles(files) { 
        this.initialBox.removeClass('active');
        if(this.fileWrapper.find('.alert').length > 0) {
            this.fileWrapper.find('.alert').remove();
        }
        globalFiles.push(...files);

        if (files.length > 0) {
            this.fileWrapper.removeClass('hidden');
        }
        
        const existingFiles = this.fileWrapper.find('.showfilebox');
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileName = file.name;
            const fileIcon = '<i class="fas fa-file-excel"></i>';
            const newIndex = existingFiles.length + i;

            const fileBox = this.createfilebox(fileName, fileIcon, newIndex);
            this.fileWrapper.append(fileBox);
        }       
    }

    createfilebox(fileName, fileIcon, newIndex) {        
        const fileBox = `
            <div class="showfilebox" data-index="${newIndex}">
                <div class="left">
                    <div class="fileicon">${fileIcon}</div>
                    <div class="filename">
                        <p>${fileName}</p>
                    </div>
                </div>
                <div class="right">
                    <div class="fileicon delete-file">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
            </div>
        `;

        return fileBox;
    }

    createAlertBox(message, color) {
        const alertBox = `
            <div class="alert alert-${color} alert-dismissible fade initial show" role="alert">
                ${message}
            </div>
        `;

        return alertBox;
    }

    removeFileAtIndex(index) {
        this.fileWrapper.find(`[data-index="${index}"]`).remove();

        globalFiles.splice(index, 1);
        
        // Menyegarkan kembali nomor index di data-index setelah file dihapus
        this.fileWrapper.find('.showfilebox').each(function (idx) {
            $(this).attr('data-index', idx);
        });
    }

    hendleUploadFile() {
        const jsProgress = $('.js-progress');
        const files = globalFiles

        if(files.length == 0) {
            // Bersihkan file yang sudah di-drop
            this.fileWrapper.html('');

            var error = this.createAlertBox('Please select an Excel to upload', 'danger');
            this.fileWrapper.removeClass('hidden');
            this.fileWrapper.append(error);
            return;
        }
        jsProgress.removeClass('hidden');
        setTimeout(() => {
            jsProgress.addClass('hidden');
            this.fileWrapper.addClass('hidden');
            this.fileWrapper.html('');
        }, 2000);
    }
}

new FileDropHandler(dropAreaSelector, fileInputSelector, fileWrapperSelector, initialBox);