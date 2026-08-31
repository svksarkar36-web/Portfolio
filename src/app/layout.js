import "./globals.css";
import Providers from "./providers";

export const metadata = {
    title: "Souvik Sarkar — Product Specialist",
    description:
        "Product Specialist at Fyn Mobility. Building AI-enabled operational platforms, fleet technology, marketplaces and workflow automation products.",
};

export const viewport = {
    themeColor: "#050505",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
