import Swal from 'sweetalert2'


export class ErrorService {

  static successMessage = (title: string, msg: string) => {
      return Swal.fire({
          title: title,
          text: msg,
          icon: "success"
        });
  }

  static errorMessage = (title: string, msg: string) => {
      return Swal.fire({
          title: title,
          text: msg,
          icon: "error"
      });
  }

  static infoMessage = (title: string, msg: string) => {
    return Swal.fire({
        title: title,
        text: msg,
        icon: "info"
      });
  }

  static mixinMessage = (msg: string, icon: string) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    return Toast.fire({
      icon: icon as any,
      title: msg
    });
  }

  static infoField = (title: string, inputLabel: string, inputPlaceholder: string) => {
    return Swal.fire({
      title: title,
      input: 'text',
      inputLabel: inputLabel,
      inputPlaceholder: inputPlaceholder,
      showCancelButton: true,
    })
  }

}