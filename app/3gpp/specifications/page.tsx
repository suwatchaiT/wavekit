import type {Metadata} from "next";
import {SiteFrame} from "../SiteFrame";
import {validateSnapshot} from "../data";
import SpecificationIndex from "./SpecificationIndex";
export const metadata:Metadata={title:"3GPP Specification Index — WaveKit",description:"Search WaveKit's dated 3GPP specification metadata snapshot."};
export default function Page(){validateSnapshot();return <SiteFrame><SpecificationIndex/></SiteFrame>}
