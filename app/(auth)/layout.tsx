import Container from "@/components/layout/container"

export default function AuthLayout({
    children,
}:{
    children:React.ReactNode
}){
    return(
        <Container className="flex flex-col justify-between items-center mt-24">
            {children}
        </Container>
    )
}