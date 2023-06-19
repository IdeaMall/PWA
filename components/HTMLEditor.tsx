import {
  AudioTool,
  Editor,
  EditorProps,
  IFrameTool,
  ImageTool,
  OriginalTools,
  VideoTool,
} from 'react-bootstrap-editor';
import { Constructor, uniqueID } from 'web-utility';

import fileStore from '../models/File';

ImageTool.prototype.save = blob =>
  fileStore.upload(new File([blob], uniqueID()));

const ExcludeTools = [IFrameTool, AudioTool, VideoTool];

const CustomTools = OriginalTools.filter(
  Tool => !ExcludeTools.includes(Tool as Constructor<IFrameTool>),
);

export default function HTMLEditor(props: EditorProps) {
  return <Editor tools={CustomTools} {...props} />;
}
