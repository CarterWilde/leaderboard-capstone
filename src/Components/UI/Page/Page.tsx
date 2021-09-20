import { SvgIconProps } from "@material-ui/core";
import { SvgIconComponent } from "@material-ui/icons";
import { ReactElement, ReactNode } from "react";
import { TextedIcon } from "..";

import "./Page.css";

export type PageProps = {
    title: string;
    aside?: ReactNode;
    icon: ReactElement<SvgIconProps, SvgIconComponent>;
    children?: ReactNode;
}

const Page = (props: PageProps) => {
    return(
        <article className="page">
            <header>
                <h6><TextedIcon icon={props.icon}>{props.title}</TextedIcon></h6>
                <aside>
                    {props.aside}
                </aside>
            </header>
            <hr/>
            <section>
                {props.children}
            </section>
        </article>
    );
}

export default Page