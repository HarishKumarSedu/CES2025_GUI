import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
    Image
  } from "@material-tailwind/react";
  
  
export const ModalDialogImage = ({src,open,handleOpen}) => {
    return (
      <Dialog open={open} handler={handleOpen} className="fixed top-1/4 left-1/4 w-1/2 h-1/2 flex items-center justify-center m-0 flex-col">
      <DialogBody  className="grid place-items-end">
      <Button variant="gradient" className="-mb-1 -mr-4  text-gray-100 text-xl rounded-full  hover:text-gray-400 lg:text-2xl" onClick={handleOpen}>
        x
      </Button>
        <img src={src} alt="" 
          className=" rounded-xl"
        />
        
      </DialogBody>
    </Dialog>
    )
  }