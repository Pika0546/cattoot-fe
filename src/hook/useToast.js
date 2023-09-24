import { useSnackbar } from "notistack"

export const useToast = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar() 
    
    const toast = {
        info: (message) => {
            enqueueSnackbar(message,{
                variant:"info"
            })
        },
        success: (message) => {
            enqueueSnackbar(message,{
                variant: "success"
            })
        },
        warning: (message) => {
            enqueueSnackbar(message,{
                variant:"warning"
            })
        },
        error: (message) => {
            enqueueSnackbar(message,{
                variant:"error"
            })
        },
        normal: (message) => {
            enqueueSnackbar(message,{
                variant:"default"
            })
        },
        hideAll: ()=>{
            closeSnackbar()
        }
    }

    return toast;
}