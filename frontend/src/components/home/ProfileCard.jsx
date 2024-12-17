import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Tooltip,
  } from "@material-tailwind/react";
   
  export default function ProfileCard({image:Link='https://docs.material-tailwind.com/img/team-3.jpg',name:Name='xyz', role:Role='Engineer'}) {
    return (
      <Card className="w-60 h-30  border border-gray-700 shadow-md shadow-gray-600 hover:shadow-sm">
        <CardHeader floated={false} className="h-30 ">
          <img src={Link} alt="profile-picture" className=" rounded-xl" />
        </CardHeader>
        <CardBody className="text-center mt-2 mb-2">
          <Typography variant="h5" color="blue-gray " className="font-bold font-serif text-gray-300 hover:text-gray-400">
            {Name}
          </Typography>
          <Typography color="blue-gray" className="font-medium" textGradient>
            {Role}
          </Typography>
        </CardBody>
      </Card>
    );
  }