export interface MenuItem {
  label: string;
  url: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  text: string;
  link: string;
  color: string;
  stack: string[];
}

export interface ProjectData {
  title: string;
  items: ProjectItem[];
}

export interface CareerItem {
  company: string;
  position: string;
  year: string;
  description: string;
  stack: string[];
}

export interface CareerData {
  title: string;
  technologies: string;
  items: CareerItem[];
}
