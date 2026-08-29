import type {Metadata} from "next";
import KnowledgeExplorer from "./KnowledgeExplorer";
import {SiteFrame} from "./SiteFrame";
import {validateSnapshot} from "./data";

export const metadata:Metadata={title:"3GPP Technology & Specification Map — WaveKit",description:"Explore 3GPP technologies, releases, features and related specifications."};
export default async function Page({searchParams}:{searchParams:Promise<{feature?:string}>}){validateSnapshot();const {feature}=await searchParams;return <SiteFrame><KnowledgeExplorer initialFeature={feature}/></SiteFrame>}
