/**
 * This configuration was generated using the CKEditor 5 Builder. You can modify it anytime using this link:
 * https://ckeditor.com/ckeditor-5/builder/#installation/NoNgNARATAdAnDADBSBGA7AFiidcDMiOiq+66qIAHPlZulJibulWwVPqeSChAKYA7FIjDBUYCVLCjUAXUgATEPwCGqDBDlA=
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
	ClassicEditor,
	Autosave,
	Essentials,
	Paragraph,
	Autoformat,
	TextTransformation,
	LinkImage,
	Link,
	ImageBlock,
	ImageToolbar,
	BlockQuote,
	Bold,
	CloudServices,
	ImageUpload,
	ImageInsertViaUrl,
	AutoImage,
	Table,
	TableToolbar,
	Heading,
	ImageTextAlternative,
	ImageCaption,
	ImageStyle,
	Indent,
	IndentBlock,
	ImageInline,
	Italic,
	List,
	MediaEmbed,
	TableCaption,
	TodoList,
	Underline,
	Fullscreen,
	Emoji,
	Mention,
	Markdown,
	PasteFromMarkdownExperimental,
	ShowBlocks,
	SourceEditing,
	GeneralHtmlSupport,
	HtmlComment,
	TextPartLanguage,
	Title,
	BalloonToolbar,
	BlockToolbar
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

// import './App.css';

const LICENSE_KEY =
	'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjY0NDc5OTksImp0aSI6Ijk0OTAyMTk0LThmNzctNGU4Ni1hZDE0LWE4MTk5MmU1YWI3MSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjQzMWJmNTQ1In0.5m3gz3LgUHamRPQd6yHig4oWvqi6ZUbszVqdVg9cCejJzAPvsoqYGu36mPLpIkiSMeA426GdCEjZ2qBATMcwOA';

export default function Editor({props}) {
	const editorContainerRef = useRef(null);
	const editorRef = useRef(null);
	const [isLayoutReady, setIsLayoutReady] = useState(false);

	useEffect(() => {
		setIsLayoutReady(true);

		return () => setIsLayoutReady(false);
	}, []);

	const { editorConfig } = useMemo(() => {
		if (!isLayoutReady) {
			return {};
		}

		return {
			editorConfig: {
				toolbar: {
					items: [
						'undo',
						'redo',
						'|',
						'sourceEditing',
						'showBlocks',
						'textPartLanguage',
						'fullscreen',
						'|',
						'heading',
						'|',
						'bold',
						'italic',
						'underline',
						'|',
						'emoji',
						'link',
						'mediaEmbed',
						'insertTable',
						'blockQuote',
						'|',
						'bulletedList',
						'numberedList',
						'todoList',
						'outdent',
						'indent'
					],
					shouldNotGroupWhenFull: false
				},
				plugins: [
					Autoformat,
					AutoImage,
					Autosave,
					BalloonToolbar,
					BlockQuote,
					BlockToolbar,
					Bold,
					CloudServices,
					Emoji,
					Essentials,
					Fullscreen,
					GeneralHtmlSupport,
					Heading,
					HtmlComment,
					ImageBlock,
					ImageCaption,
					ImageInline,
					ImageInsertViaUrl,
					ImageStyle,
					ImageTextAlternative,
					ImageToolbar,
					ImageUpload,
					Indent,
					IndentBlock,
					Italic,
					Link,
					LinkImage,
					List,
					Markdown,
					MediaEmbed,
					Mention,
					Paragraph,
					PasteFromMarkdownExperimental,
					ShowBlocks,
					SourceEditing,
					Table,
					TableCaption,
					TableToolbar,
					TextPartLanguage,
					TextTransformation,
					Title,
					TodoList,
					Underline
				],
				balloonToolbar: ['bold', 'italic', '|', 'link', '|', 'bulletedList', 'numberedList'],
				blockToolbar: ['bold', 'italic', '|', 'link', 'insertTable', '|', 'bulletedList', 'numberedList', 'outdent', 'indent'],
				fullscreen: {
					onEnterCallback: container =>
						container.classList.add(
							'editor-container',
							'editor-container_classic-editor',
							'editor-container_include-block-toolbar',
							'editor-container_include-fullscreen',
							'main-container'
						)
				},
				heading: {
					options: [
						{
							model: 'paragraph',
							title: 'Paragraph',
							class: 'ck-heading_paragraph'
						},
						{
							model: 'heading1',
							view: 'h1',
							title: 'Heading 1',
							class: 'ck-heading_heading1'
						},
						{
							model: 'heading2',
							view: 'h2',
							title: 'Heading 2',
							class: 'ck-heading_heading2'
						},
						{
							model: 'heading3',
							view: 'h3',
							title: 'Heading 3',
							class: 'ck-heading_heading3'
						},
						{
							model: 'heading4',
							view: 'h4',
							title: 'Heading 4',
							class: 'ck-heading_heading4'
						},
						{
							model: 'heading5',
							view: 'h5',
							title: 'Heading 5',
							class: 'ck-heading_heading5'
						},
						{
							model: 'heading6',
							view: 'h6',
							title: 'Heading 6',
							class: 'ck-heading_heading6'
						}
					]
				},
				htmlSupport: {
					allow: [
						{
							name: /^.*$/,
							styles: true,
							attributes: true,
							classes: true
						}
					]
				},
				image: {
					toolbar: ['toggleImageCaption', 'imageTextAlternative', '|', 'imageStyle:inline', 'imageStyle:wrapText', 'imageStyle:breakText']
				},
				initialData:props?.initialData || '',
				licenseKey: LICENSE_KEY,
				link: {
					addTargetToExternalLinks: true,
					defaultProtocol: 'https://',
					decorators: {
						toggleDownloadable: {
							mode: 'manual',
							label: 'Downloadable',
							attributes: {
								download: 'file'
							}
						}
					}
				},
				mention: {
					feeds: [
						{
							marker: '@',
							feed: [
								/* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
							]
						}
					]
				},
				placeholder: 'Type or paste your content here!',
				table: {
					contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
				}
			}
		};
	}, [isLayoutReady]);

	return (
		<div className="main-container">
			<div
				className="editor-container editor-container_classic-editor editor-container_include-block-toolbar editor-container_include-fullscreen"
				ref={editorContainerRef}
			>
				<div className="editor-container__editor">
					<div ref={editorRef}>{editorConfig && <CKEditor
                    onChange={props.onChange} 
                    editor={ClassicEditor} config={editorConfig} />}</div>
				</div>
			</div>
		</div>
	);
}
