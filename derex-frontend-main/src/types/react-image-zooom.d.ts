declare module "react-image-zooom" {
  import { Component } from "react";
  export default class ReactImageZoom extends Component<{
    className?: string;
    id?: string;
    src: string;
    zoom?: number;
    alt?: string;
    width?: string;
    height?: string;
  }> {}
}
